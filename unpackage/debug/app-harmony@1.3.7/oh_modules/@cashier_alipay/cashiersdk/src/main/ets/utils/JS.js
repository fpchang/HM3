export const JS_BRIDGE_V2 = "(function() {\n" +
    "    if (window.AlipayJSBridge) {\n" +
    "        return\n" +
    "    }\n" +
    "\n" +
    "    function alipayjsbridgeFunc(url) {\n" +
    "        var iframe = document.createElement(\"iframe\");\n" +
    "        iframe.style.width = \"1px\";\n" +
    "        iframe.style.height = \"1px\";\n" +
    "        iframe.style.display = \"none\";\n" +
    "        iframe.src = url;\n" +
    "        document.body.appendChild(iframe);\n" +
    "        setTimeout(function() {\n" +
    "            document.body.removeChild(iframe)\n" +
    "        }, 100)\n" +
    "    }\n" +
    "    window.alipayjsbridgeSetTitle = function(title) {\n" +
    "        document.title = title;\n" +
    "        alipayjsbridgeFunc(\"alipayjsbridge://setTitle?title=\" + encodeURIComponent(title))\n" +
    "    };\n" +
    "    window.alipayjsbridgeRefresh = function() {\n" +
    "        alipayjsbridgeFunc(\"alipayjsbridge://onRefresh?\")\n" +
    "    };\n" +
    "    window.alipayjsbridgeBack = function() {\n" +
    "        alipayjsbridgeFunc(\"alipayjsbridge://onBack?\")\n" +
    "    };\n" +
    "    window.alipayjsbridgeExit = function(bsucc) {\n" +
    "        alipayjsbridgeFunc(\"alipayjsbridge://onExit?bsucc=\" + bsucc)\n" +
    "    };\n" +
    "    window.alipayjsbridgeShowBackButton = function(bshow) {\n" +
    "        alipayjsbridgeFunc(\"alipayjsbridge://showBackButton?bshow=\" + bshow)\n" +
    "    };\n" +
    "    window.AlipayJSBridge = {\n" +
    "        version: \"2.0\",\n" +
    "        addListener: addListener,\n" +
    "        hasListener: hasListener,\n" +
    "        callListener: callListener,\n" +
    "        callNativeFunc: callNativeFunc,\n" +
    "        callBackFromNativeFunc: callBackFromNativeFunc\n" +
    "    };\n" +
    "    var uniqueId = 1;\n" +
    "    var h5JsCallbackMap = {};\n" +
    "\n" +
    "    function iframeCall(paramStr) {\n" +
    "        setTimeout(function() {\n" +
    "        	var iframe = document.createElement(\"iframe\");\n" +
    "        	iframe.style.width = \"1px\";\n" +
    "        	iframe.style.height = \"1px\";\n" +
    "        	iframe.style.display = \"none\";\n" +
    "        	iframe.src = \"alipayjsbridge://callNativeFunc?\" + paramStr;\n" +
    "        	var parent = document.body || document.documentElement;\n" +
    "        	parent.appendChild(iframe);\n" +
    "        	setTimeout(function() {\n" +
    "            	parent.removeChild(iframe)\n" +
    "        	}, 0)\n" +
    "        }, 0)\n" +
    "    }\n" +
    "\n" +
    "    function callNativeFunc(nativeFuncName, data, h5JsCallback) {\n" +
    "        var h5JsCallbackId = \"\";\n" +
    "        if (h5JsCallback) {\n" +
    "            h5JsCallbackId = \"cb_\" + (uniqueId++) + \"_\" + new Date().getTime();\n" +
    "            h5JsCallbackMap[h5JsCallbackId] = h5JsCallback\n" +
    "        }\n" +
    "        var dataStr = \"\";\n" +
    "        if (data) {\n" +
    "            dataStr = encodeURIComponent(JSON.stringify(data))\n" +
    "        }\n" +
    "        var paramStr = \"func=\" + nativeFuncName + \"&cbId=\" + h5JsCallbackId + \"&data=\" + dataStr;\n" +
    "        iframeCall(paramStr)\n" +
    "    }\n" +
    "\n" +
    "    function callBackFromNativeFunc(h5JsCallbackId, data) {\n" +
    "        var h5JsCallback = h5JsCallbackMap[h5JsCallbackId];\n" +
    "        if (h5JsCallback) {\n" +
    "            h5JsCallback(data);\n" +
    "            delete h5JsCallbackMap[h5JsCallbackId]\n" +
    "        }\n" +
    "    }\n" +
    "    var h5ListenerMap = {};\n" +
    "\n" +
    "    function addListener(jsFuncName, jsFunc) {\n" +
    "        h5ListenerMap[jsFuncName] = jsFunc\n" +
    "    }\n" +
    "\n" +
    "    function hasListener(jsFuncName) {\n" +
    "        var jsFunc = h5ListenerMap[jsFuncName];\n" +
    "        if (!jsFunc) {\n" +
    "            return false\n" +
    "        }\n" +
    "        return true\n" +
    "    }\n" +
    "\n" +
    "    function callListener(h5JsFuncName, data, nativeCallbackId) {\n" +
    "        var responseCallback;\n" +
    "        if (nativeCallbackId) {\n" +
    "            responseCallback = function(responseData) {\n" +
    "                var dataStr = \"\";\n" +
    "                if (responseData) {\n" +
    "                    dataStr = encodeURIComponent(JSON.stringify(responseData))\n" +
    "                }\n" +
    "                var paramStr = \"func=h5JsFuncCallback\" + \"&cbId=\" + nativeCallbackId + \"&data=\" + dataStr;\n" +
    "                iframeCall(paramStr)\n" +
    "            }\n" +
    "        }\n" +
    "        var h5JsFunc = h5ListenerMap[h5JsFuncName];\n" +
    "        if (h5JsFunc) {\n" +
    "            h5JsFunc(data, responseCallback)\n" +
    "        } else if (h5JsFuncName == \"h5BackAction\") {\n" +
    "            if (!window.alipayjsbridgeH5BackAction || !alipayjsbridgeH5BackAction()) {\n" +
    "                var paramStr = \"func=back\";\n" +
    "                iframeCall(paramStr)\n" +
    "            }\n" +
    "        } else {\n" +
    "            console.log(\"AlipayJSBridge: no h5JsFunc \" + h5JsFuncName + data)\n" +
    "        }\n" +
    "    }\n" +
    "    var event;\n" +
    "    if (window.CustomEvent) {\n" +
    "        event = new CustomEvent(\"alipayjsbridgeready\")\n" +
    "    } else {\n" +
    "        event = document.createEvent(\"Event\");\n" +
    "        event.initEvent(\"alipayjsbridgeready\", true, true)\n" +
    "    }\n" +
    "    document.dispatchEvent(event);\n" +
    "    setTimeout(excuteH5InitFuncs, 0);\n" +
    "\n" +
    "    function excuteH5InitFuncs() {\n" +
    "        if (window.AlipayJSBridgeInitArray) {\n" +
    "            var h5InitFuncs = window.AlipayJSBridgeInitArray;\n" +
    "            delete window.AlipayJSBridgeInitArray;\n" +
    "            for (var i = 0; i < h5InitFuncs.length; i++) {\n" +
    "                try {\n" +
    "                    h5InitFuncs[i](AlipayJSBridge)\n" +
    "                } catch (e) {\n" +
    "                    setTimeout(function() {\n" +
    "                        throw e\n" +
    "                    })\n" +
    "                }\n" +
    "            }\n" +
    "        }\n" +
    "    }\n" +
    "})();\n";
