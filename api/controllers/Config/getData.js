module.exports = function (req, res) {
  HelperService.getPageData()
    .then(data=>{
      res.json(data)
    })
    .catch(res.negotiate)
};