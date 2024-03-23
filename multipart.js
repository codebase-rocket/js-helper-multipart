// Info: Multipart Form-Data helper functions
'use strict';

// Shared Dependencies (Managed by Loader)
var Lib = {};

// Stream Functions Library (Private Scope)
const Readable = require('stream').Readable; // NodeJS Built in library. Used to convert Buffer to Stream

// Multipart Form-Data Builder Library (Private scope)
const FormData = require('form-data');

// Determine Buffer/Stream File-Type Library (Private scope)
const FileType = require('file-type');

// Exclusive Dependencies
var CONFIG = require('./config'); // Loader can override it with Custom-Config


/////////////////////////// Module-Loader START ////////////////////////////////

  /********************************************************************
  Load dependencies and configurations

  @param {Set} shared_libs - Reference to libraries already loaded in memory by other modules
  @param {Set} config - Custom configuration in key-value pairs

  @return nothing
  *********************************************************************/
  const loader = function(shared_libs, config){

    // Shared Dependencies (Must be loaded in memory already)
    Lib.Utils = shared_libs.Utils;
    Lib.Debug = shared_libs.Debug;

    // Override default configuration
    if( !Lib.Utils.isNullOrUndefined(config) ){
      Object.assign(CONFIG, config); // Merge custom configuration with defaults
    }

  };

//////////////////////////// Module-Loader END /////////////////////////////////



///////////////////////////// Module Exports START /////////////////////////////
module.exports = function(shared_libs, config){

  // Run Loader
  loader(shared_libs, config);

  // Return Public Funtions of this module
  return Multipart;

};//////////////////////////// Module Exports END //////////////////////////////



///////////////////////////Public Functions START///////////////////////////////
const Multipart = { // Public functions accessible by other modules

  /********************************************************************
  Convert Simple JS Set Object to Multipart Form Data
  Async Function

  @param {Set} params - Request Parameters as JS Object (Supports primitive types, Buffer, Stream)
  @param {Set} headers - Request Headers (Headers are appended by this function)

  @return {String|Buffer} body - Multipart Body as String; As Buffer if a file is sent in params
  Append Headers to Orignal headers
  *********************************************************************/
  jsObjectToFormData: async function(params, headers){

    // Initialize Form Data
    var form_data = new FormData();

    // Loop Keys of JS Object
    for( var key in params ){

      // Copy Param value
      const data = params[key];


      // Append Key-Data for Form-Data

      // Check if this key's value is Stream
      if( _Multipart.isStream(data) ){

        // Get file-type of Stream
        const result = await FileType.fromStream(data); // {ext: 'jpg', mime: 'image/jpeg'}
        const file_type = result ? result['mime'] : 'plain/text'; // If unknown file-type, then use 'text' as default

        // Append this key to form-Data
        form_data.append(key, data, {contentType: file_type} );

      }

      // Check if this key's value is Buffer
      else if( Buffer.isBuffer(data) ){

        // Get file-type of Buffer
        const result = await FileType.fromBuffer(data); // {ext: 'jpg', mime: 'image/jpeg'}
        const file_type = result ? result['mime'] : 'plain/text'; // If unknown file-type, then use 'text' as default

        // Append this key to form-Data (Convert Buffer to Stream)
        form_data.append(key, _Multipart.bufferToStream(data), {contentType: file_type} );

      }
      else{
        form_data.append(key, data); // Append this key to form-Data
      }

    }


    // Append Multipart Headers to Request Headers
    headers['Content-Type'] = form_data.getHeaders()['content-type']; // Content-Type and Multipart-Boundry

    // Return Body
    return form_data;

  },


  /********************************************************************
  TODO: Convert Simple JS Set Object to Multipart Form Data
  Multipart Parser (Finite State Machine)
  Ref: https://github.com/freesoftwarefactory/parse-multipart

  @param {String|Buffer} body - Multipart Body as String
  @param {String} boundary - Boundary

  @return [{Set},{Set}] [params, files] - Params and Files
  *********************************************************************/
  formDataToJsObject: function(body, boundary){
    // TODO
  },

};///////////////////////////Public Functions END///////////////////////////////



//////////////////////////Private Functions START///////////////////////////////
const _Multipart = { // Private functions accessible within this modules only

  /********************************************************************
  Check if an object is Stream

  @param {Object} stream - Object to be checked if its Stream

  @return {Boolean} - True if Stream. Else, False
  *********************************************************************/
  isStream: function(stream){

    return (
      stream !== null &&
      typeof stream === 'object' &&
      typeof stream.pipe === 'function'
    );

  },


  /********************************************************************
  Converts Buffer to Stream

  @param {Buffer} buffer - File as Buffer

  @return {Stream} stream - File as Stream
  *********************************************************************/
  bufferToStream: function(buffer){

    // Initialize Stream
    var stream = new Readable();

    // Convert Buffer to Stream
    stream.push(buffer);
    stream.push(null); // End of file

    // Return
    return stream;

  },

};//////////////////////////Private Functions END///////////////////////////////
