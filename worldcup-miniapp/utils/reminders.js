var config = require("./reminder-config.js");
var following = require("./following.js");

function requestReminderSubscription(cb) {
  var templateId = config.matchReminderTemplateId;
  if (!templateId) {
    cb(null, { subscribed: false, reason: "missing-template" });
    return;
  }
  if (typeof wx === "undefined" || !wx.requestSubscribeMessage) {
    cb(null, { subscribed: false, reason: "unsupported" });
    return;
  }
  wx.requestSubscribeMessage({
    tmplIds: [templateId],
    success: function (res) {
      cb(null, {
        subscribed: res[templateId] === "accept",
        templateId: templateId,
        raw: res,
      });
    },
    fail: function (err) {
      cb(err);
    },
  });
}

function saveReminder(currentReminders, item, subscription) {
  item.subscribed = !!(subscription && subscription.subscribed);
  item.templateId = subscription && subscription.templateId ? subscription.templateId : "";
  item.pushStatus = item.subscribed ? "subscribed" : "local";
  return following.upsertReminder(currentReminders, item);
}

module.exports = {
  requestReminderSubscription: requestReminderSubscription,
  saveReminder: saveReminder,
};
