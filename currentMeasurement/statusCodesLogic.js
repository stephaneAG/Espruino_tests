/*
  R: status codes:
  0 -> no device connected ( available )
  1 -> device connected & charging ( busy )
  2 -> device connected & charged ( awaiting pickup )
*/
var statusCodes = [0, 0, 0, 0]; // default status codes, one for each space

// get a space's status code
function getSpaceStatus(spaceIdx){ return statusCodes[spaceIdx-1]; }

// set a space's status code
function setSpaceStatus(spaceIdx, statusCode){ statusCodes[spaceIdx-1] = statusCode; }

// get all the spaces' status codes as a string
function getSpacesStatusCodesStr(){ return statusCodes.join(','); }
