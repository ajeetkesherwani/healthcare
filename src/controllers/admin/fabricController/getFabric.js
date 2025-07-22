const Fabric = require("../../../models/fabric");

exports.getAllFabric = async (req, res) => {
    try {

        const allFabric = await Fabric.find();
        if (!allFabric) {
            return res.status(400).json({ success: false, message: "fabric not found" });
        }

        res.status(200).json({ success: true, message: "all fabric found", count: allFabric.length, data: allFabric });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}