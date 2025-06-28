async function getSavedTravellers(req, res) {
  res.json({ msg: "Get Saved Travellers Route is Working" });
}

async function addToSavedTraveller(req, res) {
  res.json({ msg: "addToSavedTravellers Route is Working" });
}

async function deleteSavedTraveller(req, res) {
  res.json({ msg: "deleteSavedTraveller Route is Working" });
}

module.exports = {
  getSavedTravellers,
  addToSavedTraveller,
  deleteSavedTraveller,
};
