/* Backend API for the sync service */
// for http status codes see http://www.restapitutorial.com/httpstatuscodes.html
function SyncApi(params) {
    var logger  = params.logger || console;
    this.get    = params.get;
    this.create = params.create;
    this.update = params.update;
    this.del    = params.del;
    
    if(!params.express)throw 'SyncApi params require an express instance';
    if(!params.ns)params.ns = '/sync';

    params.express.get(params.ns+'/:id', (function(req, res) {
      var id = req.params.id;
      if(!id) {
          res.status(400).json({error:'need object id'});
      } else {
        this.get(id, function(obj) {
          if(!obj) {
            res.status(404).json({error:'no object of that id'});
          } else {
            res.status(302).json(obj);
          }
        });
      }
    }).bind(this));
    params.express.post(params.ns, (function(req, res) {
      var model = req.body.model;
      if(!model) {
          res.status(400).json({error:'missing model field'});
      } else {
          this.create(model, function(model) {
            if(model.$id) { // they successfully created it
              res.status(200).json(model);
            } else {
              res.status(500).json({error: 'failed to create object'});
            }
          });
      }
    }).bind(this));
    params.express.put(params.ns, (function(req, res) {
      var model = req.body.model;
      if(!model) {
          res.status(400).json({error:'missing model field'});
      } else {
          this.update(model, function(model) {
            if(!model) { // they successfully created it
              res.status(200).json(model);
            } else {
              res.status(500).json({error: 'failed to update object'});
            }
          });
      };
    }).bind(this));
    params.express.delete(params.ns, (function(req, res) {
      var id = req.params.id;
      if(!id) {
          res.status(400).json({error:'need object id'});
      } else {
        this.get(id, function(obj) {
          if(!obj) {
            res.status(404).json({error:'no object of that id'});
          } else {
            res.status(302).json(obj);
          }
        });
      }
    }).bind(this));
};

module.exports = SyncApi;
