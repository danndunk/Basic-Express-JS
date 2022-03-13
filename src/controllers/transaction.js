const { transaction } = require("../../models");

exports.addTransaction = async (req, res) => {
  try {
    const { idUser, transferProof } = req.body;

    const newTransaction = await transaction.create({
      idUser: idUser,
      transferProof: transferProof,
      remainingActive: 0,
      userStatus: "Not Active",
      paymentStatus: "Pending",
    });

    res.status(200).send({
      status: "success",
      data: {
        newTransaction,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "failed",
      message: "Server Error",
    });
  }
};
