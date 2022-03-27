const { transaction, user } = require("../../models");

exports.addTransaction = async (req, res) => {
  try {
    const { idUser } = req.body;

    const newTransaction = await transaction.create({
      idUser,
      transferProof: req.file.filename,
      remainingActive: 0,
      userStatus: "Not Active",
      paymentStatus: "Pending",
    });

    const transactionData = await transaction.findOne({
      where: {
        id: newTransaction.id,
      },
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["id", "password", "role", "createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["idUser", "createdAt", "updatedAt"],
      },
    });

    res.status(200).send({
      status: "success",
      data: {
        transaction: transactionData,
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

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await transaction.findAll({
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["id", "password", "role", "createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    res.send({
      status: "success",
      data: {
        transactions,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transactionData = await transaction.findOne({
      where: {
        idUser: id,
      },
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["id", "password", "role", "createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["idUser", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: {
        transaction: transactionData,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.editTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    function getDurationTime(startDate) {
      startDate = new Date();

      const endDate = new Date();

      const getDateEndDate = endDate.getDate();

      const set30daysEndDate = getDateEndDate + 30;

      endDate.setDate(set30daysEndDate);

      const miliseconds = 1000;
      const secondsInMinutes = 60;
      const minutesInHours = 60;
      const secondsInHours = secondsInMinutes * minutesInHours;
      const hoursInDay = 24;

      const timeDuration = endDate - startDate;
      let dayDuration =
        timeDuration / (miliseconds * secondsInHours * hoursInDay);

      return dayDuration;
    }

    const date = new Date();

    const approvedData = {
      remainingActive: getDurationTime(date),
      userStatus: "Active",
      paymentStatus: "Approved",
    };

    const notApprovedData = {
      remainingActive: 0,
      userStatus: "Not Active",
      paymentStatus: "Cancel",
    };

    if (paymentStatus === "approved" || paymentStatus === "Approved") {
      await transaction.update(approvedData, {
        where: {
          id: id,
        },
      });
    } else {
      await transaction.update(notApprovedData, {
        where: {
          id: id,
        },
      });
    }

    let transactionData = await transaction.findOne({
      where: {
        id,
      },
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["id", "password", "role", "createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["idUser", "createdAt"],
      },
    });

    transactionData = JSON.parse(JSON.stringify(transactionData));

    res.send({
      status: "success",
      data: {
        transaction: transactionData,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
