const express = require('express');
const router = express.Router();
const webRoot = __dirname.replace('server', '');

router.route('/:fileName')
  .get(getFile);

function getFile(req, res){
  //req.originalUrl contains the fileName, as well as specifying /dist or /public
  let filePath = req.originalUrl;
  if (filePath.includes('?')) filePath = filePath.slice(0, filePath.indexOf('?'));
  res.status(200).sendFile(webRoot + filePath);
}

module.exports = router;
