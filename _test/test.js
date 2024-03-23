// Info: Test Cases
'use strict';

// Shared Dependencies
var Lib = {};

// Set Configrations
const multipart_config = {};

// Dependencies
Lib.Utils = require('js-helper-utils');
Lib.Debug = require('js-helper-debug')(Lib);
const Multipart = require('js-helper-multipart')(Lib, multipart_config);


////////////////////////////SIMILUTATIONS//////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////////////


/////////////////////////////STAGE SETUP///////////////////////////////////////

const fs = require('fs');

// Dummy File for Multipart Form
const file_text = fs.readFileSync('dummy_data/simple.txt');
const file_small = fs.readFileSync('dummy_data/4kb.png');
const file_large = fs.readFileSync('dummy_data/5mb.jpg');

// Dummy Multipart Form
const body = fs.readFileSync('dummy_data/body.txt');
const content_type = 'multipart/form-data; boundary=----------------------------647757764728232038009600;';
const boundry = '----------------------------647757764728232038009600';

// Dummy Form Params
var form = {
  'param1': 'yellow',
  'param2': 'red',
  'file1_image': file_small,
  'file2_text': file_text
};

// Dummy Headers
var headers = {
  'header1': 'hello',
  'header2': 'world'
};

///////////////////////////////////////////////////////////////////////////////


/////////////////////////////////TESTS/////////////////////////////////////////

// Test .jsObjectToFormData() function
(async function wrapper(){ // Async Wrapper
  console.log(
    'jsObjectToFormData',
    await Multipart.jsObjectToFormData(form, headers)
  );
  console.log(
    'headers',
    headers
  );
})(); // Close Async Wrapper

///////////////////////////////////////////////////////////////////////////////
