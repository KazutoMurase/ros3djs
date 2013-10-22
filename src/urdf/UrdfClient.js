/**
 * @author Jihoon Lee - jihoonlee.in@gmail.com
 * @author Russell Toris - rctoris@wpi.edu
 */

/**
 * A URDF client can be used to load a URDF and its associated models into a 3D object from the ROS
 * parameter server.
 *
 * Emits the following events:
 * * 'change' - emited after the URDF and its meshes have been loaded into the root object
 *
 * @constructor
 * @param options - object with following keys:
 *   * ros - the ROSLIB.Ros connection handle
 *   * param (optional) - the paramter to load the URDF from, like 'robot_description'
 *   * tfClient - the TF client handle to use
 *   * path (optional) - the base path to the associated Collada models that will be loaded
 *   * rootObject (optional) - the root object to add this marker to
 */
ROS3D.UrdfClient = function(options) {
  var that = this;
  options = options || {};
  var ros = options.ros;
  var param = options.param || 'robot_description';
  this.path = options.path || '/';
  this.tfClient = options.tfClient;
  this.tfPrefix = options.tfPrefix || null;
  this.color = options.color || null;
  this.rootObject = options.rootObject || new THREE.Object3D();
  this.model = null;

  // get the URDF value from ROS
  var getParam = new ROSLIB.Param({
    ros : ros,
    name : param
  });
  getParam.get(function(string) {
    // hand off the XML string to the URDF model
    var urdfModel = new ROSLIB.UrdfModel({
      string : string
    });
   that.model = new ROS3D.Urdf({
      urdfModel : urdfModel,
      path : that.path,
      tfPrefix : that.tfPrefix,
      tfClient : that.tfClient,
      color : that.color
    });
    // load all models
    that.rootObject.add(that.model);
  });
};

ROS3D.UrdfClient.prototype.remove = function(){
    this.rootObject.remove(this.model);
};