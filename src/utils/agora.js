// utils/agora.js
const { RtcTokenBuilder, RtcRole } = require("agora-token");

const generateAgoraToken = (channelName, uid, role, expireSeconds = 3600) => {
    const appID = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    const expirationTimeInSeconds = Math.floor(Date.now() / 1000) + expireSeconds;
    return RtcTokenBuilder.buildTokenWithUid(
        appID,
        appCertificate,
        channelName,
        parseInt(uid),
        role,
        expirationTimeInSeconds
    );
};

module.exports = generateAgoraToken;
