package io.slingr.endpoints.apidaze;

import io.slingr.endpoints.HttpEndpoint;
import io.slingr.endpoints.framework.annotations.ApplicationLogger;
import io.slingr.endpoints.framework.annotations.EndpointProperty;
import io.slingr.endpoints.framework.annotations.EndpointWebService;
import io.slingr.endpoints.framework.annotations.SlingrEndpoint;
import io.slingr.endpoints.services.AppLogs;
import io.slingr.endpoints.services.rest.RestMethod;
import io.slingr.endpoints.utils.Json;
import io.slingr.endpoints.ws.exchange.WebServiceRequest;
import io.slingr.endpoints.ws.exchange.WebServiceResponse;
import org.apache.http.entity.ContentType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * <p>Apidaze endpoint
 * <p>
 * <p>Created by dgaviola on 09/04/17.
 */
@SlingrEndpoint(name = "apidaze", functionPrefix = "_")
public class ApidazeEndpoint extends HttpEndpoint {
    private static final Logger logger = LoggerFactory.getLogger(ApidazeEndpoint.class);

    @ApplicationLogger
    private AppLogs appLogger;

    @EndpointProperty
    private String appId;

    @EndpointProperty
    private String apiKey;

    public ApidazeEndpoint() {
    }

    public ApidazeEndpoint(String appId, String apiKey) {
        this.appId = appId;
        this.apiKey = apiKey;
    }

    @Override
    public String getApiUri() {
        return "https://api4.apidaze.io/" + appId;
    }

    @Override
    public void endpointStarted() {
        httpService().setupDefaultHeader("Content-Type", "application/x-www-form-urlencoded");
        httpService().setupDefaultParam("api_secret", apiKey);
    }

    @EndpointWebService(methods = {RestMethod.GET}, path = "/script")
    public WebServiceResponse getScript(WebServiceRequest request){
        Json params = request.getParameters();
        logger.info("Get external script with params: "+params.toString());
        Object scriptObj = events().sendSync("scriptRequested", params);
        if (scriptObj instanceof Json){
            Json script = ((Json) scriptObj).json("nodes");
            String xmlResponse = null;
            try {
                xmlResponse = convertScriptToXml(script);
            } catch (Exception e) {
                logger.warn(String.format("Error converting script to XML. Script: %s", script.toString()));
                appLogger.error("Error converting script to XML", e);
            }
            if(xmlResponse != null) {
                return new WebServiceResponse(xmlResponse, ContentType.TEXT_XML.toString());
            }
        } else {
            appLogger.error("App response for event [scriptRequested] is not valid. It must be a JSON script object.");
        }
        return new WebServiceResponse(getDefaultResponse(), ContentType.TEXT_XML.toString());


    }

    private String getDefaultResponse() {
        return "<document><work><hangup/></work></document>";
    }

    public String convertScriptToXml(Json script) {
        StringBuilder sb = new StringBuilder();
        sb.append("<document><work>");
        sb.append(convertScriptToXmlRecursive(script));
        sb.append("</work></document>");
        return sb.toString();
    }

    private String convertScriptToXmlRecursive(Json script) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < script.size(); i++) {
            Json node = (Json) script.object(i);
            sb.append("<").append(node.string("name"));
            if (node.contains("attrs")) {
                Json attrs = node.json("attrs");
                for (String key : attrs.keys()) {
                    Object val = attrs.object(key);
                    if (val != null) {
                        sb.append(" ").append(key).append("=\"").append(val).append("\"");
                    }
                }
            }
            sb.append(">");
            if (!node.isEmpty("value")) {
                sb.append(node.object("value"));
            }
            if (node.contains("children")) {
                sb.append(convertScriptToXmlRecursive((Json) node.object("children")));
            }
            sb.append("</").append(node.string("name")).append(">");
        }
        return sb.toString();
    }
}
