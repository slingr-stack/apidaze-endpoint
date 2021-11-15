---
title: Apidaze endpoint
keywords: 
last_updated: September 7, 2017
tags: []
summary: "Detailed description of the API of the Apidaze endpoint."
---

## Overview

The Apidaze endpoint has the following features:
 
- Authentication for an Apidaze's app
- Access to the whole REST API
- Helpers to build scripts
- Automatic configuration of external scripts

Coming features:

- WebRTC integration: will allow to use a phone right there in the SLINGR app.
- Conversations support: will allow to easily build a multi-script workflow without having to worry about redirecting
  calls to different XML files.

Please make sure you take a look at the documentation from Apidaze as features are based on its API:

- [API Reference](https://developers.apidaze.io/docs)
- [Script Reference](https://developers.apidaze.io/script-reference)

## Quick start

Once you have configured the endpoint, you can place a call like this:

```js
var call = app.endpoints.apidaze.placeCall('', 'number', originPhoneNumber, destinationPhoneNumber);
log('call: ' + JSON.stringify(call));
```

And you should have handle the `Script requested` event with a listener like this one:
 
```js
var script = app.endpoints.apidaze.createScript();

script.answer();
script.wait(5);
script.speak('Please wait while we connect to an agent', 'en-US');
script.dial().number(event.data.destination_number);
script.hangup();

return script.build();
```

Basically it will place a call between `originPhoneNumber` and `destinationPhoneNumber`.

## Configuration

You will need a developer account for Apidaze and you need to create an application there.

### App ID

The ID of the application to use with the endpoint.

### API key

The API key of the application needed to validate requests.

## Javascript API

### REST API shortcuts

The endpoint provides methods to access all methods in the [REST API](https://developers.apidaze.io/docs).
Here is a list of the available methods in the API, but you should check Apidaze's documentation for more
information:

```js
// XML Scripting API

app.endpoints.apidaze.listExternalScripts();
app.endpoints.apidaze.createExternalScript(name, url);
app.endpoints.apidaze.readExternalScript(id);
app.endpoints.apidaze.updateExternalScript(id, name, url);
app.endpoints.apidaze.deleteExternalScript(id);
app.endpoints.apidaze.testExternalScript(url, parameters);

// Call Management API

app.endpoints.apidaze.placeCall(callerid, type, origin, destination);
app.endpoints.apidaze.listActiveCalls();
app.endpoints.apidaze.readActiveCall(uuid);
app.endpoints.apidaze.transferActiveCall(uuid, url);
app.endpoints.apidaze.sendFax(number, path, subject);
app.endpoints.apidaze.sendSms(number, subject, body);

// VoIP SIP API

app.endpoints.apidaze.listNumbers();
app.endpoints.apidaze.readNumber(id);
app.endpoints.apidaze.searchNumber(country, prefix, limit);
app.endpoints.apidaze.buyNumber(country, prefix);
app.endpoints.apidaze.releaseNumber(id);
app.endpoints.apidaze.createExternalNumber(number);
app.endpoints.apidaze.deleteExternalNumber(id);
    

app.endpoints.apidaze.listPhones();
app.endpoints.apidaze.createPhone(model, mac_address, username, blf);
app.endpoints.apidaze.readPhone(id);
app.endpoints.apidaze.updatePhone(id, model, mac_address, id_sipaccount, blf);
app.endpoints.apidaze.deletePhone(id);
app.endpoints.apidaze.listSipAccounts();
app.endpoints.apidaze.createSipAccount(username, internal_caller_id_number, external_caller_id_number, name, mwi_account);
app.endpoints.apidaze.readSipAccount(id);
app.endpoints.apidaze.updateSipAccount(id, internal_caller_id_number, external_caller_id_number, name, mwi_account);
app.endpoints.apidaze.deleteSipAccount(id);
app.endpoints.apidaze.statusOfSipAccount(id);
app.endpoints.apidaze.listSipTrunks();
app.endpoints.apidaze.createSipTrunk(name, server, register, username, password);
app.endpoints.apidaze.readSipTrunk(id);
app.endpoints.apidaze.updateSipTrunk(id, server, register, username, password);
app.endpoints.apidaze.deleteSipTrunk(id);

app.endpoints.apidaze.listVoicemailBoxes();
app.endpoints.apidaze.createVoicemailBox(mailbox, password, name);
app.endpoints.apidaze.readVoicemailBox(id);
app.endpoints.apidaze.updateVoicemailBox(id, password, name);
app.endpoints.apidaze.deleteVoicemailBox(id);
app.endpoints.apidaze.listVoicemailBoxMessages(id);
app.endpoints.apidaze.deleteVoicemailBoxMessage(id, uuid);
app.endpoints.apidaze.downloadVoicemailBoxMessage(id, uuid);

// Billing API

app.endpoints.apidaze.listBillingAccounts();
app.endpoints.apidaze.createBillingAccount(name, cash);
app.endpoints.apidaze.readBillingAccount(id);
app.endpoints.apidaze.updateBillingAccount(id, name, cash);
app.endpoints.apidaze.deleteBillingAccount(id);
app.endpoints.apidaze.listCdrHttpHandlers();
app.endpoints.apidaze.createCdrHttpHandler(name, url);
app.endpoints.apidaze.readCdrHttpHandler(id);
app.endpoints.apidaze.updateCdrHttpHandler(id, name, url);
app.endpoints.apidaze.deleteCdrHttpHandler(id);

// Miscellaneous API

app.endpoints.apidaze.createApplication(name, description);
app.endpoints.apidaze.listMediaFiles();
app.endpoints.apidaze.uploadMediaFile(file_id);
app.endpoints.apidaze.deleteMediaFile(name);
app.endpoints.apidaze.listRecordings();
app.endpoints.apidaze.downloadRecording(filename);
app.endpoints.apidaze.deleteRecording(name);
app.endpoints.apidaze.validateCredentials();
```

### Scripts

The endpoint provides some helpers to create Apidaze scripts in Javascript. The first thing you need
to do is create a new script:

```js
var script = app.endpoints.apidaze.createScript();
```

You are probably going to use this method in a listener catching a [Script requested](#script-requested) event.

Then you can use different methods to build the script. For example:

```js
// init script
var script = app.endpoints.apidaze.createScript();
// build your script using
script.answer();
script.wait(5);
script.speak('This is a test script. Thanks for contacting us!', 'en-US');
script.hangup();
// send the script to Apidaze
return script.build();
```

Below is a more detailed explanation of methods:

#### Dial

```js
script.dial(options)
  .number(number)
  .sipaccount(sipaccount);
```

For example:

```js
script.dial({timeout: 10}).number('17258470093');
```

That will translate to:

```xml
<dial timeout="10">
    <number>17258470093</number>
</dial>
```

#### Answer

```js
script.answer();
```

For example:

```js
script.answer()
```

That will translate to:

```xml
<answer></answer>
```

#### Playback

```js
script.playback(file);
```

For example:

```js
script.playback('https://app.slingrs./${APP_ENV}/runtime/public/message1.wav');
```

That will translate to:

```xml
<playback>https://app.slingrs./dev/runtime/public/message1.wav</playback>
```

#### Ringback

```js
script.ringback(file);
```

For example:

```js
script.ringback('https://app.slingrs./${APP_ENV}/runtime/public/tone.wav');
```

That will translate to:

```xml
<ringback>https://app.slingrs./dev/runtime/public/tone.wav</ringback>
```

#### Echo

```js
script.echo(millis);
```

For example:

```js
script.echo(500);
```

That will translate to:

```xml
<echo>500</echo>
```

#### Hangup

```js
script.hangup();
```

For example:

```js
script.hangup();
```

That will translate to:

```xml
<hangup></hangup>
```

#### Intercept

```js
script.intercept(uuid);
```

For example:

```js
script.intercept('f28a3e29-dac4-462c-bf94-b1d518ddbe2d');
```

That will translate to:

```xml
<intercept>f28a3e29-dac4-462c-bf94-b1d518ddbe2d</intercept>
```

#### Speak

```js
script.speak(text, lang);
```

For example:

```js
script.speak('This is a test application', 'en-US');
```

That will translate to:

```xml
<speak lang="en-US">This is a test application</speak>
```

#### Bind

```js
script.speak(text, lang).bind(action, value);
script.playback(file).bind(action, value);
```

For example:

```js
script.speak('Select an option from 1 3', 'en-US')
    .bind(endpointUrl+'?bind=1', 1)
    .bind(endpointUrl+'?bind=2', 2)
    .bind(endpointUrl+'?bind=3', 3);
```

That will translate to:

```xml
<speak lang="en-US">Select an option from 1 3
    <bind action="https://app.slingrs.io/dev/endpoints/apidaze/script?bind=1">1</bind>
    <bind action="https://app.slingrs.io/dev/endpoints/apidaze/script?bind=2">2</bind>
    <bind action="https://app.slingrs.io/dev/endpoints/apidaze/script?bind=3">3</bind>
</speak>
```

#### Wait

```js
script.wait(seconds);
```

For example:

```js
script.wait(5);
```

That will translate to:

```xml
<wait>5</wait>
```

#### Conference

```js
script.conference(name);
```

For example:

```js
script.conference('my_meeting_room');
```

That will translate to:

```xml
<conference>my_meeting_room</conference>
```

#### Build

```js
script.build();
```

This method needs to be called when you returned the script in the listener:

```js
var script = app.endpoints.apidaze.createScript();
// build your script here
return script.build();
```

## Events

### Script requested

When Apidaze calls you external script URL (which is configured by the endpoint automatically), you
will get an event of this type.

In `event.data` object you will be able to find all the parameters sent by Apidaze. For example you
can access parameters like this:

```js
sys.logs.info('*** session id: ' + event.data.session_id);
```

Take a look at the [Script Reference](https://developers.apidaze.io/script-reference) to see more
information about script parameters.

When you process an event of type `Script requested` you need to send a script as response:

```js
if (!event.data.exiting) {
    var script = app.endpoints.apidaze.createScript();
    // build your script using
    script.answer();
    script.wait(5);
    script.speak('This is a test script. Thanks for contacting us!', 'en-US');
    script.hangup();
    // send the script to Apidaze
    return script.build();
}
```

## About SLINGR

SLINGR is a low-code rapid application development platform that accelerates development, with robust architecture for integrations and executing custom workflows and automation.

[More info about SLINGR](https://slingr.io)

## License

This endpoint is licensed under the Apache License 2.0. See the `LICENSE` file for more details.
