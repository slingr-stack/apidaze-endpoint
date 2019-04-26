//////////////////////////////////////////
// Public API - Generic Functions
//////////////////////////////////////////

endpoint.get = function (url, options) {
    var options = checkHttpOptions(url, {params: options});
    return endpoint._get(options);
};

endpoint.post = function (url, options) {
    options = checkHttpOptions(url, options);
    return endpoint._post(options);
};

endpoint.put = function (url, options) {
    options = checkHttpOptions(url, options);
    return endpoint._put(options);
};

endpoint.delete = function (url) {
    var options = checkHttpOptions(url, {});
    return endpoint._delete(options);
};

//////////////////////////////////////////
// Script functions
//////////////////////////////////////////

var Script = function () {
    var self = this;

    self.nodes = [];

    self.dial = function (options) {
        var children = [];
        self.nodes.push({name: 'dial', attrs: options, children: children});
        return new ScriptDial(children);
    };

    self.answer = function () {
        self.nodes.push({name: 'answer'});
    };

    self.playback = function (file) {
        var children = [];
        self.nodes.push({name: 'playback', value: file, children: children});
        return new ScriptBind(children);
    };

    self.ringback = function (file) {
        self.nodes.push({name: 'ringback', value: file});
    };

    self.echo = function (millis) {
        self.nodes.push({name: 'echo', value: millis});
    };

    self.hangup = function () {
        self.nodes.push({name: 'hangup'});
    };

    self.intercept = function (uuid) {
        self.nodes.push({name: 'intercept', value: uuid});
    };

    self.speak = function (text, lang) {
        var children = [];
        self.nodes.push({name: 'speak', attrs: {lang: lang}, value: text, children: children});
        return new ScriptBind(children);
    };

    self.wait = function (seconds) {
        self.nodes.push({name: 'wait', value: seconds});
    };

    self.conference = function (name) {
        self.nodes.push({name: 'conference', value: name});
    };

    self.build = function () {
        return {nodes: self.nodes};
    };

    return self;
};

var ScriptDial = function (nodes) {
    var self = this;

    self.nodes = nodes;

    self.number = function (number) {
        self.nodes.push({name: 'number', value: number});
        return self;
    };

    self.sipaccount = function (acount) {
        self.nodes.push({name: 'sipaccount', value: account});
        return self;
    };

    return self;
};

var ScriptBind = function (nodes) {
    var self = this;

    self.nodes = nodes;

    self.bind = function (action, value) {
        self.nodes.push({name: 'bind', attrs: {action: action}, value: value});
        return self;
    };

    return self;
};

endpoint.createScript = function (event) {
    return new Script(event);
};

//////////////////////////////////////////
// Helpers
//////////////////////////////////////////

// XML Scripting API

endpoint.listExternalScripts = function () {
    return endpoint.get('/externalscripts');
};

endpoint.createExternalScript = function (name, url) {
    return endpoint.post('/externalscripts', {name: name, url: url});
};

endpoint.readExternalScript = function (id) {
    return endpoint.get('/externalscripts/' + id);
};

endpoint.updateExternalScript = function (id, name, url) {
    return endpoint.put('/externalscripts/' + id, {name: name, url: url});
};

endpoint.deleteExternalScript = function (id) {
    return endpoint.put('/externalscripts/' + id);
};

endpoint.testExternalScript = function (url, parameters) {
    return endpoint.get('/externalscripts/test', {url: url, parameters: parameters});
};

// Call Management API

endpoint.placeCall = function (callerid, type, origin, destination) {
    return endpoint.post('/calls', {callerid: callerid, type: type, origin: origin, destination: destination});
};

endpoint.listActiveCalls = function () {
    return endpoint.get('/calls');
};

endpoint.readActiveCall = function (uuid) {
    return endpoint.get('/calls/' + uuid);
};

endpoint.transferActiveCall = function (uuid, url) {
    return endpoint.post('/calls/' + uuid, {url: url});
};

endpoint.sendFax = function (number, path, subject) {
    return endpoint.post('/fax/send', {number: number, path: path, subject: subject});
};

endpoint.sendSms = function (number, subject, body) {
    return endpoint.post('/sms/send', {number: number, subject: subject, body: body});
};

// VoIP SIP API

endpoint.listNumbers = function () {
    return endpoint.get('/numbers');
};

endpoint.readNumber = function (id) {
    return endpoint.get('/numbers/' + id);
};

endpoint.searchNumber = function (country, prefix, limit) {
    return endpoint.get('/numbers/search', {country: country, prefix: prefix, limit: limit});
};

endpoint.buyNumber = function (country, prefix) {
    return endpoint.post('/numbers/buy', {country: country, prefix: prefix});
};

endpoint.releaseNumber = function (id) {
    return endpoint.post('/numbers/release/' + id);
};

endpoint.createExternalNumber = function (number) {
    return endpoint.post('/numbers', {number: number});
};

endpoint.deleteExternalNumber = function (id) {
    return endpoint.delete('/numbers/' + id);
};

endpoint.listPhones = function () {
    return endpoint.get('/provisioning');
};

endpoint.createPhone = function (model, mac_address, username, blf) {
    return endpoint.post('/provisioning', {model: model, mac_address: mac_address, username: username, blf: blf});
};

endpoint.readPhone = function (id) {
    return endpoint.get('/provisioning/' + id);
};

endpoint.updatePhone = function (id, model, mac_address, id_sipaccount, blf) {
    return endpoint.put('/provisioning/' + id, {
        model: model,
        mac_address: mac_address,
        id_sipaccount: id_sipaccount,
        blf: blf
    });
};

endpoint.deletePhone = function (id) {
    return endpoint.delete('/provisioning/' + id);
};

endpoint.listSipAccounts = function () {
    return endpoint.get('/sipaccounts');
};

endpoint.createSipAccount = function (username, internal_caller_id_number, external_caller_id_number, name, mwi_account) {
    return endpoint.post('/sipaccounts', {
        username: username,
        internal_caller_id_number: internal_caller_id_number,
        external_caller_id_number: external_caller_id_number,
        name: name,
        mwi_account: mwi_account
    });
};

endpoint.readSipAccount = function (id) {
    return endpoint.get('/sipaccounts/' + id);
};


endpoint.updateSipAccount = function (id, internal_caller_id_number, external_caller_id_number, name, mwi_account) {
    return endpoint.put('/sipaccounts/' + id, {
        internal_caller_id_number: internal_caller_id_number,
        external_caller_id_number: external_caller_id_number,
        name: name,
        mwi_account: mwi_account
    });
};

endpoint.deleteSipAccount = function (id) {
    return endpoint.delete('/sipaccounts/' + id);
};

endpoint.statusOfSipAccount = function (id) {
    return endpoint.get('/sipaccounts/' + id + '/status');
};

endpoint.listSipTrunks = function () {
    return endpoint.get('/siptrunks');
};

endpoint.createSipTrunk = function (name, server, register, username, password) {
    return endpoint.post('/siptrunks', {
        name: name,
        server: server,
        register: register,
        username: username,
        password: password
    });
};

endpoint.readSipTrunk = function (id) {
    return endpoint.get('/siptrunks/' + id);
};

endpoint.updateSipTrunk = function (id, server, register, username, password) {
    return endpoint.put('/siptrunks/' + id, {
        server: server,
        register: register,
        username: username,
        password: password
    });
};

endpoint.deleteSipTrunk = function (id) {
    return endpoint.delete('/siptrunks/' + id);
};

endpoint.listVoicemailBoxes = function () {
    return endpoint.get('/voicemails');
};

endpoint.createVoicemailBox = function (mailbox, password, name) {
    return endpoint.post('/voicemails', {mailbox: mailbox, password: password, name: name});
};

endpoint.readVoicemailBox = function (id) {
    return endpoint.get('/voicemails/' + id);
};

endpoint.updateVoicemailBox = function (id, password, name) {
    return endpoint.put('/voicemails/' + id, {password: password, name: name});
};

endpoint.deleteVoicemailBox = function (id) {
    return endpoint.delete('/voicemails/' + id);
};

endpoint.listVoicemailBoxMessages = function (id) {
    return endpoint.get('/voicemails/' + id + '/messages');
};

endpoint.deleteVoicemailBoxMessage = function (id, uuid) {
    return endpoint.delete('/voicemails/' + id + '/messages/' + uuid);
};

endpoint.downloadVoicemailBoxMessage = function (id, uuid) {
    return endpoint.get({
        path: '/voicemails/' + id + '/messages/' + uuid,
        forceDownload: true,
        downloadSync: true
    });
};

// Billing API

endpoint.listBillingAccounts = function () {
    return endpoint.get('/billingaccounts');
};

endpoint.createBillingAccount = function (name, cash) {
    return endpoint.post('/billingaccounts', {name: name, cash: cash});
};

endpoint.readBillingAccount = function (id) {
    return endpoint.get('/billingaccounts/' + id);
};

endpoint.updateBillingAccount = function (id, name, cash) {
    return endpoint.put('/billingaccounts/' + id, {name: name, cash: cash});
};

endpoint.deleteBillingAccount = function (id) {
    return endpoint.delete('/billingaccounts/' + id);
};

endpoint.listCdrHttpHandlers = function () {
    return endpoint.get('/cdrhttphandlers');
};

endpoint.createCdrHttpHandler = function (name, url) {
    return endpoint.post('/cdrhttphandlers', {name: name, url: url});
};

endpoint.readCdrHttpHandler = function (id) {
    return endpoint.get('/cdrhttphandlers/' + id);
};

endpoint.updateCdrHttpHandler = function (id, name, url) {
    return endpoint.put('/cdrhttphandlers/' + id, {name: name, url: url});
};

endpoint.deleteCdrHttpHandler = function (id) {
    return endpoint.delete('/cdrhttphandlers/' + id);
};

// Miscellaneous API

endpoint.createApplication = function (name, description) {
    return endpoint.post('/applications', {name: name, description: description});
};

endpoint.listMediaFiles = function () {
    return endpoint.get('/mediafiles');
};

endpoint.uploadMediaFile = function (file_id) {
    return endpoint.post({
        path: '/mediafiles',
        filesToAttach: file_id
    });
};

endpoint.deleteMediaFile = function (name) {
    return endpoint.delete('/mediafiles/' + name);
};

endpoint.listRecordings = function () {
    return endpoint.get('/recordings');
};

endpoint.downloadRecording = function (filename) {
    return endpoint.get({
        path: '/recordings/' + filename,
        forceDownload: true,
        downloadSync: true
    });
};

endpoint.deleteRecording = function (name) {
    return endpoint.delete('/recordings/' + name);
};

endpoint.validateCredentials = function () {
    return endpoint.get('/validate');
};

// JS layer helpers

var checkHttpOptions = function (url, options) {
    options = options || {};
    if (!!url) {
        if (isObject(url)) {
            // take the 'url' parameter as the options
            options = url || {};
        } else {
            if (!!options.path || !!options.params || !!options.body) {
                // options contains the http package format
                options.path = url;
            } else {
                // create html package
                options = {
                    path: url,
                    body: options
                }
            }
        }
    }
    return options;
};

var isObject = function (obj) {
    return !!obj && stringType(obj) === '[object Object]'
};

var stringType = Function.prototype.call.bind(Object.prototype.toString);