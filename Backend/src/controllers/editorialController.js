const SolutionVideo = require("../models/solutionVideo");

const saveEditorial = async (req, res) => {
    try {
        console.log(req.body);
        // const { problemId } = req.params;
        // const { textEditorial } = req.body;
        

        // const userId = req.result._id;
        
        const { problemId, textEditorial } = req.body;
        console.log("problemId:", problemId, "textEditorial length:", textEditorial?.length);
        
        // Safely extract userId from either req.result (adminMiddleware) or req.user (userMiddleware)
        const userId = req.result?._id || req.user?._id;
        console.log("Extracted userId:", userId);
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User ID not found in request."
            });
        }

        let editorial = await SolutionVideo.findOne({ problemId });

        if (!editorial) {

            editorial = await SolutionVideo.create({
                problemId,
                userId,
                textEditorial
            });

        } else {

            editorial.textEditorial = textEditorial;
            editorial.userId = userId; // Ensure userId is updated/set for legacy records missing it
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