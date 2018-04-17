var app = {
    inCallColor : "rgb(0, 180, 0)",

    outOfCallColor : "rgb(150, 150, 150)",

    start: function () {
        app.logit('Initializing adapter')

        app.getCookie('number1');
        app.getCookie('number2');
        app.getCookie('number3');

        $('#getCallCenterSettingsButton').click(app.getCallCenterSettings);
        $('#setSoftphoneHeightButton').click(app.setSoftphonePanelHeight);
        $('#getPageInfoButton').click(app.getPageInfo);
        $('#getSoftphoneLayoutButton').click(app.getSoftphoneLayout);
        $('#number1button').click(app.simulateCall);
        $('#number2button').click(app.simulateCall);
        $('#number3button').click(app.simulateCall);

        app.logit('Adapter Loaded');
    },

    simulateCall: function (e) {
        var button =  $(this);
        var icon = $(this).children('span');
        var cookieName = 'open-cti-' + $(button).parent().prev().attr('id');
        var phone = $(button).parent().prev().val();
        var color = $(icon).css("color");
        var inCall = color === app.inCallColor ? true : false;
        if (inCall) {
            app.logit("Hanging up phone");
            $(icon).css({"color": app.outOfCallColor});
        } else {
            if (phone !== '') {
                Cookies.set(cookieName, phone);
                $(icon).css({"color": app.inCallColor});
                app.logit("Simulating inbound call");
                app.logit("ANI: " + phone);
                app.logit("Searching for contact by phone");
                app.apexSearchContact(phone);
            } else {
                app.logit("No ANI identified")
            }
        }
    },

    apexSearchContactCallback: function (response) {
        app.logit('apexSearchContactCallback()');
        if (response != undefined) {
            if (response.success) {
                app.logit(response.returnValue);
                var contacts = JSON.parse(response.returnValue);
                var page = '/'+contacts[0].Id;
                sforce.opencti.screenPop({type:sforce.opencti.SCREENPOP_TYPE.SOBJECT,
                                        params: contacts[0].Id});
            } else {
                app.logit('Error apexSearchContactCallback: ' + response.errors);
            }
        } else {
            app.logit('Error apexSearchContactCallback: no response');
        }
    },

    apexSearchContact: function (val) {
        app.logit('runApex OpenCtiSearchContact(' + val + ')');
        sforce.opencti.runApex({apexClass:'OpenCtiSearchContact',
                                methodName:'getContacts',
                                methodParams:'name=' + val,
                                callback:app.apexSearchContactCallback});
    },

    getCookie: function (id) {
        var cookieName = 'open-cti-' + id;
        var cookieValue = Cookies.get(cookieName);
        if(cookieValue){
            if(cookieValue !== ""){
                $('#' + id).val(cookieValue);
            }
        }
    },

    getCallCenterSettingsCallback: function (response) {
        if (response.success) {
            app.logit(response.returnValue);
        } else {
            app.logit('Error retrieving call center settings' + response.errors);
        }
    },

    getCallCenterSettings: function () {
        app.logit("calling getCallCenterSettings()");
        sforce.opencti.cti.getCallCenterSettings({callback:app.getCallCenterSettingsCallback});
    },

    setSoftphonePanelHeightCallback: function (response) {
        if (response.success) {
            app.logit('Setting softphone height to 300 px was successful.');
        } else {
            app.logit('Setting softphone height failed.');
        }
    },

    setSoftphonePanelHeight: function () {
        app.logit("calling setSoftphonePanelHeight()");
        sforce.opencti.cti.setSoftphonePanelHeight({heightPX:400, callback:app.setSoftphonePanelHeightCallback});
    },

    getSoftphoneLayoutCallback: function (response) {
        if (response.success) {
            app.logit(response.returnValue);
        } else {
            app.logit('Error occurred while trying to getSoftphoneLayout:' + response.errors);
        }
    },
    getSoftphoneLayout: function () {
        app.logit("calling getSoftphoneLayout");
        sforce.opencti.getSoftphoneLayout({callback:app.getSoftphoneLayoutCallback});
    },
    logit: function (entry) {
        $('#logArea').append(entry + "<br/>");
        $("#logArea")[0].scrollTop = $("#logArea")[0].scrollHeight;
    },

    finesseLogin: function(){

    },
    finesseLogout: function(){

    },
    finesseNotificationregister: function(){

    },
    finesseNotificationCallback: function(){

    }
}


$(document).ready(function () {
    app.start();
});
