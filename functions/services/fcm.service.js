var serviceAccount = require("../config/serviceAccount.json");
var FCM = require('fcm-node');
var fcm = new FCM(serviceAccount);

exports.SendByToken = (token, body, data) => {
    let message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: token,
        //collapse_key: 'your_collapse_key',

        notification: {
            title: 'تكويد',
            body: body
        },
        data
    }
    fcm.send(message, function (err, response) {
        if (err) {
            console.error("Something has gone wrong!")
            console.error(err)
        } else {
            console.log("Successfully sent with response: ", response)
        }
    })
}

exports.SubscribeToTopic = (tokens = [], topic, data) => {
    fcm.subscribeToTopic(tokens, topic, (err, response) => {
        if (err) {
            console.error("Something has gone wrong!")
        } else {
            console.log("Successfully SubscribeToTopic  response: ", response)
        }
    });
}

exports.UnsubscribeToTopic = (tokens = [], topic, data) => {
    fcm.unsubscribeToTopic(tokens, topic, (err, response) => {
        if (err) {
            console.error("Something has gone wrong!")
        } else {
            console.log("Successfully SubscribeToTopic  response: ", response)
        }
    });
}

 