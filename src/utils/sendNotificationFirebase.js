const admin = require('firebase-admin');

function sendNotificationToDevice(deviceToken, title, body, data = {}) {
  if (deviceToken) {
    const message = {
      notification: {
        title,
        body,
      },
      data,
      token: deviceToken,
    };

    admin
      .messaging()
      .send(message)
      .then((response) => {
        // eslint-disable-next-line no-console
        console.log('Successfully sent notification:', response);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error sending notification:', error);
      });
  }
}

module.exports = sendNotificationToDevice;
