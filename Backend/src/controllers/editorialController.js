const SolutionVideo = require("../models/solutionVideo");

const saveEditorial = async (req, res) => {
    try {
        console.log(req.body);
        // const { problemId } = req.params;
        // const { textEditorial } = req.body;
        

        // const userId = req.result._id;
        
        const { problemId, textEditorial } = req.body;
        console.log(problemId, textEditorial);
        const userId = req.result._id;
        console.log(userId);
        let editorial = await SolutionVideo.findOne({ problemId });

        if (!editorial) {

            editorial = await SolutionVideo.create({
                problemId,
                userId,
                textEditorial
            });

        } else {

            editorial.textEditorial = textEditorial;
            await editorial.save();

        }

        return res.status(200).json({
            success: true,
            message: "Editorial saved successfully",
            editorial
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};
const getEditorial = async (req, res) => {
    try {
        
        const { problemId } = req.params;

        const editorial = await SolutionVideo.findOne({ problemId });

        return res.status(200).json(editorial);

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    saveEditorial,
    getEditorial
};