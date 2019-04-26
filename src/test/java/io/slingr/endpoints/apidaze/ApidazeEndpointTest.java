package io.slingr.endpoints.apidaze;

import io.slingr.endpoints.utils.Json;
import io.slingr.endpoints.utils.tests.EndpointTests;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;

import static org.junit.Assert.*;

@Ignore("For dev purposes")
public class ApidazeEndpointTest {

    private static EndpointTests test;
    private static ApidazeEndpoint endpoint;

    @BeforeClass
    public static void init() throws Exception {
        test = EndpointTests.start(new io.slingr.endpoints.apidaze.Runner(), "test.properties");
        endpoint = (ApidazeEndpoint) test.getEndpoint();
    }

    @Test
    public void getExternalScripts() {
        Json body = Json.map()
                .set("path", "/externalscripts");
        Json res = endpoint.httpService().defaultGetRequest(body);
        assertNotNull(res);
        assertTrue(res.isList());
    }

    @Test
    public void convertToXml() {
        String script1 = "[{\"name\":\"answer\"},{\"name\":\"wait\",\"value\":5},{\"name\":\"speak\",\"attrs\":{\"lang\":\"en-US\"},\"value\":\"Pleas wait until we connect\",\"children\":[]},{\"name\":\"dial\",\"attrs\":{\"timeout\":10},\"children\":[{\"name\":\"number\",\"value\":\"1112223333\"}]},{\"name\":\"wait\",\"value\":5},{\"name\":\"hangup\"}]\n";
        String xml = endpoint.convertScriptToXml(Json.parse(script1));
        assertNotNull(xml);
        System.out.println(xml);
    }
}
