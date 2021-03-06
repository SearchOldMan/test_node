{
  "source": "doc/api/dgram.markdown",
  "modules": [
    {
      "textRaw": "UDP / Datagram Sockets",
      "name": "dgram",
      "stability": 2,
      "stabilityText": "Stable",
      "desc": "<p>The <code>dgram</code> module provides an implementation of UDP Datagram sockets.\n\n</p>\n<pre><code class=\"js\">const dgram = require(&#39;dgram&#39;);\nconst server = dgram.createSocket(&#39;udp4&#39;);\n\nserver.on(&#39;error&#39;, (err) =&gt; {\n  console.log(`server error:\\n${err.stack}`);\n  server.close();\n});\n\nserver.on(&#39;message&#39;, (msg, rinfo) =&gt; {\n  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);\n});\n\nserver.on(&#39;listening&#39;, () =&gt; {\n  var address = server.address();\n  console.log(`server listening ${address.address}:${address.port}`);\n});\n\nserver.bind(41234);\n// server listening 0.0.0.0:41234</code></pre>\n",
      "classes": [
        {
          "textRaw": "Class: dgram.Socket",
          "type": "class",
          "name": "dgram.Socket",
          "desc": "<p>The <code>dgram.Socket</code> object is an [<code>EventEmitter</code>][] that encapsulates the\ndatagram functionality.\n\n</p>\n<p>New instances of <code>dgram.Socket</code> are created using [<code>dgram.createSocket()</code>][].\nThe <code>new</code> keyword is not to be used to create <code>dgram.Socket</code> instances.\n\n</p>\n",
          "events": [
            {
              "textRaw": "Event: 'close'",
              "type": "event",
              "name": "close",
              "desc": "<p>The <code>&#39;close&#39;</code> event is emitted after a socket is closed with [<code>close()</code>][].\nOnce triggered, no new <code>&#39;message&#39;</code> events will be emitted on this socket.\n\n</p>\n",
              "params": []
            },
            {
              "textRaw": "Event: 'error'",
              "type": "event",
              "name": "error",
              "params": [],
              "desc": "<p>The <code>&#39;error&#39;</code> event is emitted whenever any error occurs. The event handler\nfunction is passed a single Error object.\n\n</p>\n"
            },
            {
              "textRaw": "Event: 'listening'",
              "type": "event",
              "name": "listening",
              "desc": "<p>The <code>&#39;listening&#39;</code> event is emitted whenever a socket begins listening for\ndatagram messages. This occurs as soon as UDP sockets are created.\n\n</p>\n",
              "params": []
            },
            {
              "textRaw": "Event: 'message'",
              "type": "event",
              "name": "message",
              "params": [],
              "desc": "<p>The <code>&#39;message&#39;</code> event is emitted when a new datagram is available on a socket.\nThe event handler function is passed two arguments: <code>msg</code> and <code>rinfo</code>. The\n<code>msg</code> argument is a [<code>Buffer</code>][] and <code>rinfo</code> is an object with the sender&#39;s\naddress information provided by the <code>address</code>, <code>family</code> and <code>port</code> properties:\n\n</p>\n<pre><code class=\"js\">socket.on(&#39;message&#39;, (msg, rinfo) =&gt; {\n  console.log(&#39;Received %d bytes from %s:%d\\n&#39;,\n              msg.length, rinfo.address, rinfo.port);\n});</code></pre>\n"
            }
          ],
          "methods": [
            {
              "textRaw": "socket.addMembership(multicastAddress[, multicastInterface])",
              "type": "method",
              "name": "addMembership",
              "signatures": [
                {
                  "params": [
                    {
                      "textRaw": "`multicastAddress` {String} ",
                      "name": "multicastAddress",
                      "type": "String"
                    },
                    {
                      "textRaw": "`multicastInterface` {String}, Optional ",
                      "name": "multicastInterface",
                      "type": "String",
                      "optional": true
                    }
                  ]
                },
                {
                  "params": [
                    {
                      "name": "multicastAddress"
                    },
                    {
                      "name": "multicastInterface",
                      "optional": true
                    }
                  ]
                }
              ],
              "desc": "<p>Tells the kernel to join a multicast group at the given <code>multicastAddress</code>\nusing the <code>IP_ADD_MEMBERSHIP</code> socket option. If the <code>multicastInterface</code>\nargument is not specified, the operating system will try to add membership to\nall valid networking interfaces.\n\n</p>\n"
            },
            {
              "textRaw": "socket.address()",
              "type": "method",
              "name": "address",
              "desc": "<p>Returns an object containing the address information for a socket.\nFor UDP sockets, this object will contain <code>address</code>, <code>family</code> and <code>port</code>\nproperties.\n\n</p>\n",
              "signatures": [
                {
                  "params": []
                }
              ]
            },
            {
              "textRaw": "socket.bind([port][, address][, callback])",
              "type": "method",
              "name": "bind",
              "signatures": [
                {
                  "params": [
                    {
                      "textRaw": "`port` {Number} - Integer, Optional ",
                      "name": "port",
                      "type": "Number",
                      "optional": true,
                      "desc": "Integer"
                    },
                    {
                      "textRaw": "`address` {String}, Optional ",
                      "name": "address",
                      "type": "String",
                      "optional": true
                    },
                    {
                      "textRaw": "`callback` {Function} with no parameters, Optional. Called when binding is complete. ",
                      "name": "callback",
                      "type": "Function",
                      "desc": "with no parameters, Optional. Called when binding is complete.",
                      "optional": true
                    }
                  ]
                },
                {
                  "params": [
                    {
                      "name": "port",
                      "optional": true
                    },
                    {
                      "name": "address",
                      "optional": true
                    },
                    {
                      "name": "callback",
                      "optional": true
                    }
                  ]
                }
              ],
              "desc": "<p>For UDP sockets, causes the <code>dgram.Socket</code> to listen for datagram messages on a\nnamed <code>port</code> and optional <code>address</code>. If <code>port</code> is not specified, the operating\nsystem will attempt to bind to a random port. If <code>address</code> is not specified,\nthe operating system will attempt to listen on all addresses.  Once binding is\ncomplete, a <code>&#39;listening&#39;</code> event is emitted and the optional <code>callback</code> function\nis called.\n\n</p>\n<p>Note that specifying both a <code>&#39;listening&#39;</code> event listener and passing a\n<code>callback</code> to the <code>socket.bind()</code> method is not harmful but not very\nuseful.\n\n</p>\n<p>A bound datagram socket keeps the Node.js process running to receive\ndatagram messages.\n\n</p>\n<p>If binding fails, an <code>&#39;error&#39;</code> event is generated. In rare case (e.g.\nattempting to bind with a closed socket), an [<code>Error</code>][] may be thrown.\n\n</p>\n<p>Example of a UDP server listening on port 41234:\n\n</p>\n<pre><code class=\"js\">const dgram = require(&#39;dgram&#39;);\nconst server = dgram.createSocket(&#39;udp4&#39;);\n\nserver.on(&#39;error&#39;, (err) =&gt; {\n  console.log(`server error:\\n${err.stack}`);\n  server.close();\n});\n\nserver.on(&#39;message&#39;, (msg, rinfo) =&gt; {\n  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);\n});\n\nserver.on(&#39;listening&#39;, () =&gt; {\n  var address = server.address();\n  console.log(`server listening ${address.address}:${address.port}`);\n});\n\nserver.bind(41234);\n// server listening 0.0.0.0:41234</code></pre>\n"
            },
            {
              "textRaw": "socket.bind(options[, callback])",
              "type": "method",
              "name": "bind",
              "signatures": [
                {
                  "params": [
                    {
                      "textRaw": "`options` {Object} - Required. Supports the following properties: ",
                      "options": [
                        {
                          "textRaw": "`port` {Number} - Required. ",
                          "name": "port",
                          "type": "Number",
                          "desc": "Required."
                        },
                        {
                          "textRaw": "`address` {String} - Optional. ",
                          "name": "address",
                          "type": "String",
                          "desc": "Optional."
                        },
                        {
                          "textRaw": "`exclusive` {Boolean} - Optional. ",
                          "name": "exclusive",
                          "type": "Boolean",
                          "desc": "Optional."
                        }
                      ],
                      "name": "options",
                      "type": "Object",
                      "desc": "Required. Supports the following properties:"
                    },
                    {
                      "textRaw": "`callback` {Function} - Optional. ",
                      "name": "callback",
                      "type": "Function",
                      "desc": "Optional.",
                      "optional": true
                    }
                  ]
                },
                {
                  "params": [
                    {
                      "name": "options"
                    },
                    {
                      "name": "callback",
                      "optional": true
                    }
                  ]
                }
              ],
              "desc": "<p>For UDP sockets, causes the <code>dgram.Socket</code> to listen for datagram messages on a\nnamed <code>port</code> and optional <code>address</code> that are passed as properties of an\n<code>options</code> object passed as the first argument. If <code>port</code> is not specified, the\noperating system will attempt to bind to a random port. If <code>address</code> is not\nspecified, the operating system will attempt to listen on all addresses.  Once\nbinding is complete, a <code>&#39;listening&#39;</code> event is emitted and the optional\n<code>callback</code> function is called.\n\n</p>\n<p>The <code>options</code> object may contain an additional <code>exclusive</code> property that is\nuse when using <code>dgram.Socket</code> objects with the [<code>cluster</code>] module. When\n<code>exclusive</code> is set to <code>false</code> (the default), cluster workers will use the same\nunderlying socket handle allowing connection handling duties to be shared.\nWhen <code>exclusive</code> is <code>true</code>, however, the handle is not shared and attempted\nport sharing results in an error.\n\n</p>\n<p>An example socket listening on an exclusive port is shown below.\n\n</p>\n<pre><code class=\"js\">socket.bind({\n  address: &#39;localhost&#39;,\n  port: 8000,\n  exclusive: true\n});</code></pre>\n"
            },
            {
              "textRaw": "socket.close([callback])",
              "type": "method",
              "name": "close",
              "desc": "<p>Close the underlying socket and stop listening for data on it. If a callback is\nprovided, it is added as a listener for the [<code>&#39;close&#39;</code>][] event.\n\n</p>\n",
              "signatures": [
                {
                  "params": [
                    {
                      "name": "callback",
                      "optional": true
                    }
                  ]
                }
              ]
            },
            {
              "textRaw": "socket.dropMembership(multicastAddress[, multicastInterface])",
              "type": "method",
              "name": "dropMembership",
              "signatures": [
                {
                  "params": [
                    {
                      "textRaw": "`multicastAddress` {String} ",
                      "name": "multicastAddress",
                      "type": "String"
                    },
                    {
                      "textRaw": "`multicastInterface` {String}, Optional ",
                      "name": "multicastInterface",
                      "type": "String",
                      "optional": true
                    }
                  ]
                },
                {
                  "params": [
                    {
                      "name": "multicastAddress"
                    },
                    {
                      "name": "multicastInterface",
                      "optional": true
                    }
                  ]
                }
              ],
              "desc": "<p>Instructs the kernel to leave a multicast group at <code>multicastAddress</code> using the\n<code>IP_DROP_MEMBERSHIP</code> socket option. This method is automatically called by the\nkernel when the socket is closed or the process terminates, so most apps will\nnever have reason to call this.\n\n</p>\n<p>If <code>multicastInterface</code> is not specified, the operating system will attempt to\ndrop membership on all valid interfaces.\n\n</p>\n"
            },
            {
              "textRaw": "socket.send(msg, [offset, length,] port, address[, callback])",
              "type": "method",
              "name": "send",
              "signatures": [
                {
                  "params": [
                    {
                      "textRaw": "`buf` {Buffer|String|Array} Message to be sent ",
                      "name": "buf",
                      "type": "Buffer|String|Array",
                      "desc": "Message to be sent"
                    },
                    {
                      "textRaw": "`offset` {Number} Integer. Optional. Offset in the buffer where the message starts. ",
                      "name": "offset",
                      "type": "Number",
                      "desc": "Integer. Optional. Offset in the buffer where the message starts."
                    },
                    {
                      "textRaw": "`length` {Number} Integer. Optional. Number of bytes in the message. ",
                      "name": "length",
                      "type": "Number",
                      "desc": "Integer. Optional. Number of bytes in the message."
                    },
                    {
                      "textRaw": "`port` {Number} Integer. Destination port. ",
                      "name": "port",
                      "type": "Number",
                      "desc": "Integer. Destination port."
                    },
                    {
                      "textRaw": "`address` {String} Destination hostname or IP address. ",
                      "name": "address",
                      "type": "String",
                      "desc": "Destination hostname or IP address."
                    },
                    {
                      "textRaw": "`callback` {Function} Called when the message has been sent. Optional. ",
                      "name": "callback",
                      "type": "Function",
                      "desc": "Called when the message has been sent. Optional.",
                      "optional": true
                    }
                  ]
                },
                {
                  "params": [
                    {
                      "name": "msg"
                    },
                    {
                      "name": "offset"
                    },
                    {
                      "name": "length"
                    },
                    {
                      "name": "] port"
                    },
                    {
                      "name": "address"
                    },
                    {
                      "name": "callback",
                      "optional": true
                    }
                  ]
                }
              ],
              "desc": "<p>Broadcasts a datagram on the socket. The destination <code>port</code> and <code>address</code> must\nbe specified.\n\n</p>\n<p>The <code>msg</code> argument containins the message to be sent.\nDepending on its type, different behavior can apply. If <code>msg</code> is a <code>Buffer</code>,\nthe <code>offset</code> and <code>length</code> specify the offset within the <code>Buffer</code> where the\nmessage begins and the number of bytes in the message, respectively.\nIf <code>msg</code> is a <code>String</code>, then it is automatically converted to a <code>Buffer</code>\nwith <code>&#39;utf8&#39;</code> enecoding. With messages that\ncontain  multi-byte characters, <code>offset</code> and <code>length</code> will be calculated with\nrespect to [byte length][] and not the character position.\nIf <code>msg</code> is an array, <code>offset</code> and <code>length</code> must not be specified.\n\n</p>\n<p>The <code>address</code> argument is a string. If the value of <code>address</code> is a host name,\nDNS will be used to resolve the address of the host. If the <code>address</code> is not\nspecified or is an empty string, <code>&#39;0.0.0.0&#39;</code> or <code>&#39;::0&#39;</code> will be used instead.\nIt is possible, depending on the network configuration, that these defaults\nmay not work; accordingly, it is best to be explicit about the destination\naddress.\n\n</p>\n<p>If the socket has not been previously bound with a call to <code>bind</code>, the socket\nis assigned a random port number and is bound to the &quot;all interfaces&quot; address\n(<code>&#39;0.0.0.0&#39;</code> for <code>udp4</code> sockets, <code>&#39;::0&#39;</code> for <code>udp6</code> sockets.)\n\n</p>\n<p>An optional <code>callback</code> function  may be specified to as a way of reporting\nDNS errors or for determining when it is safe to reuse the <code>buf</code> object.\nNote that DNS lookups delay the time to send for at least one tick of the\nNode.js event loop.\n\n</p>\n<p>The only way to know for sure that the datagram has been sent is by using a\n<code>callback</code>. If an error occurs and a <code>callback</code> is given, the error will be\npassed as the first argument to the <code>callback</code>. If a <code>callback</code> is not given,\nthe error is emitted as an <code>&#39;error&#39;</code> event on the <code>socket</code> object.\n\n</p>\n<p>Offset and length are optional, but if you specify one you would need to\nspecify the other. Also, they are supported only when the first\nargument is a <code>Buffer</code>.\n\n</p>\n<p>Example of sending a UDP packet to a random port on <code>localhost</code>;\n\n</p>\n<pre><code class=\"js\">const dgram = require(&#39;dgram&#39;);\nconst message = new Buffer(&#39;Some bytes&#39;);\nconst client = dgram.createSocket(&#39;udp4&#39;);\nclient.send(message, 41234, &#39;localhost&#39;, (err) =&gt; {\n  client.close();\n});</code></pre>\n<p>Example of sending a UDP packet composed of multiple buffers to a random port on <code>localhost</code>;\n\n</p>\n<pre><code class=\"js\">const dgram = require(&#39;dgram&#39;);\nconst buf1 = new Buffer(&#39;Some &#39;);\nconst buf2 = new Buffer(&#39;bytes&#39;);\nconst client = dgram.createSocket(&#39;udp4&#39;);\nclient.send([buf1, buf2], 41234, &#39;localhost&#39;, (err) =&gt; {\n  client.close();\n});</code></pre>\n<p>Sending multiple buffers might be faster or slower depending on your\napplication and operating system: benchmark it. Usually it is faster.\n\n</p>\n<p><strong>A Note about UDP datagram size</strong>\n\n</p>\n<p>The maximum size of an <code>IPv4/v6</code> datagram depends on the <code>MTU</code>\n(<em>Maximum Transmission Unit</em>) and on the <code>Payload Length</code> field size.\n\n</p>\n<ul>\n<li><p>The <code>Payload Length</code> field is <code>16 bits</code> wide, which means that a normal\npayload exceed 64K octets <em>including</em> the internet header and data\n(65,507 bytes = 65,535 − 8 bytes UDP header − 20 bytes IP header);\nthis is generally true for loopback interfaces, but such long datagram\nmessages are impractical for most hosts and networks.</p>\n</li>\n<li><p>The <code>MTU</code> is the largest size a given link layer technology can support for\ndatagram messages. For any link, <code>IPv4</code> mandates a minimum <code>MTU</code> of <code>68</code>\noctets, while the recommended <code>MTU</code> for IPv4 is <code>576</code> (typically recommended\nas the <code>MTU</code> for dial-up type applications), whether they arrive whole or in\nfragments.</p>\n<p>For <code>IPv6</code>, the minimum <code>MTU</code> is <code>1280</code> octets, however, the mandatory minimum\nfragment reassembly buffer size is <code>1500</code> octets. The value of <code>68</code> octets is\nvery small, since most current link layer technologies, like Ethernet, have a\nminimum <code>MTU</code> of <code>1500</code>.</p>\n</li>\n</ul>\n<p>It is impossible to know in advance the MTU of each link through which\na packet might travel. Sending a datagram greater than the receiver <code>MTU</code> will\nnot work because the packet will get silently dropped without informing the\nsource that the data did not reach its intended recipient.\n\n</p>\n"
            },
            {
              "textRaw": "socket.setBroadcast(flag)",
              "type": "method",
              "name": "setBroadcast",
              "signatures": [
                {
                  "params": [
                    {
                      "textRaw": "`flag` {Boolean} ",
                      "name": "flag",
                      "type": "Boolean"
                    }
                  ]
                },
                {
                  "params": [
                    {
                      "name": "flag"
                    }
                  ]
                }
              ],
              "desc": "<p>Sets or clears the <code>SO_BROADCAST</code> socket option.  When set to <code>true</code>, UDP\npackets may be sent to a local interface&#39;s broadcast address.\n\n</p>\n"
            },
            {
              "textRaw": "socket.setMulticastLoopback(flag)",
              "type": "method",
              "name": "setMulticastLoopback",
              "signatures": [
                {
                  "params": [
                    {
                      "textRaw": "`flag` {Boolean} ",
                      "name": "flag",
                      "type": "Boolean"
                    }
                  ]
                },
                {
                  "params": [
                    {
                      "name": "flag"
                    }
                  ]
                }
              ],
              "desc": "<p>Sets or clears the <code>IP_MULTICAST_LOOP</code> socket option.  When set to <code>true</code>,\nmulticast packets will also be received on the local interface.\n\n</p>\n"
            },
            {
              "textRaw": "socket.setMulticastTTL(ttl)",
              "type": "method",
              "name": "setMulticastTTL",
              "signatures": [
                {
                  "params": [
                    {
                      "textRaw": "`ttl` {Number} Integer ",
                      "name": "ttl",
                      "type": "Number",
                      "desc": "Integer"
                    }
                  ]
                },
                {
                  "params": [
                    {
                      "name": "ttl"
                    }
                  ]
                }
              ],
              "desc": "<p>Sets the <code>IP_MULTICAST_TTL</code> socket option.  While TTL generally stands for\n&quot;Time to Live&quot;, in this context it specifies the number of IP hops that a\npacket is allowed to travel through, specifically for multicast traffic.  Each\nrouter or gateway that forwards a packet decrements the TTL. If the TTL is\ndecremented to 0 by a router, it will not be forwarded.\n\n</p>\n<p>The argument passed to to <code>socket.setMulticastTTL()</code> is a number of hops\nbetween 0 and 255. The default on most systems is <code>1</code> but can vary.\n\n</p>\n"
            },
            {
              "textRaw": "socket.setTTL(ttl)",
              "type": "method",
              "name": "setTTL",
              "signatures": [
                {
                  "params": [
                    {
                      "textRaw": "`ttl` {Number} Integer ",
                      "name": "ttl",
                      "type": "Number",
                      "desc": "Integer"
                    }
                  ]
                },
                {
                  "params": [
                    {
                      "name": "ttl"
                    }
                  ]
                }
              ],
              "desc": "<p>Sets the <code>IP_TTL</code> socket option. While TTL generally stands for &quot;Time to Live&quot;,\nin this context it specifies the number of IP hops that a packet is allowed to\ntravel through.  Each router or gateway that forwards a packet decrements the\nTTL.  If the TTL is decremented to 0 by a router, it will not be forwarded.\nChanging TTL values is typically done for network probes or when multicasting.\n\n</p>\n<p>The argument to <code>socket.setTTL()</code> is a number of hops between 1 and 255.\nThe default on most systems is 64 but can vary.\n\n</p>\n"
            },
            {
              "textRaw": "socket.ref()",
              "type": "method",
              "name": "ref",
              "desc": "<p>By default, binding a socket will cause it to block the Node.js process from\nexiting as long as the socket is open. The <code>socket.unref()</code> method can be used\nto exclude the socket from the reference counting that keeps the Node.js\nprocess active. The <code>socket.ref()</code> method adds the socket back to the reference\ncounting and restores the default behavior.\n\n</p>\n<p>Calling <code>socket.ref()</code> multiples times will have no additional effect.\n\n</p>\n<p>The <code>socket.ref()</code> method returns a reference to the socket so calls can be\nchained.\n\n</p>\n",
              "signatures": [
                {
                  "params": []
                }
              ]
            },
            {
              "textRaw": "socket.unref()",
              "type": "method",
              "name": "unref",
              "desc": "<p>By default, binding a socket will cause it to block the Node.js process from\nexiting as long as the socket is open. The <code>socket.unref()</code> method can be used\nto exclude the socket from the reference counting that keeps the Node.js\nprocess active, allowing the process to exit even if the socket is still\nlistening.\n\n</p>\n<p>Calling <code>socket.unref()</code> multiple times will have no addition effect.\n\n</p>\n<p>The <code>socket.unref()</code> method returns a reference to the socket so calls can be\nchained.\n\n</p>\n",
              "signatures": [
                {
                  "params": []
                }
              ]
            }
          ],
          "modules": [
            {
              "textRaw": "Change to asynchronous `socket.bind()` behavior",
              "name": "change_to_asynchronous_`socket.bind()`_behavior",
              "desc": "<p>As of Node.js v0.10, [<code>dgram.Socket#bind()</code>][] changed to an asynchronous\nexecution model. Legacy code that assumes synchronous behavior, as in the\nfollowing example:\n\n</p>\n<pre><code class=\"js\">const s = dgram.createSocket(&#39;udp4&#39;);\ns.bind(1234);\ns.addMembership(&#39;224.0.0.114&#39;);</code></pre>\n<p>Must be changed to pass a callback function to the [<code>dgram.Socket#bind()</code>][]\nfunction:\n\n</p>\n<pre><code class=\"js\">const s = dgram.createSocket(&#39;udp4&#39;);\ns.bind(1234, () =&gt; {\n  s.addMembership(&#39;224.0.0.114&#39;);\n});</code></pre>\n",
              "type": "module",
              "displayName": "Change to asynchronous `socket.bind()` behavior"
            }
          ]
        }
      ],
      "modules": [
        {
          "textRaw": "`dgram` module functions",
          "name": "`dgram`_module_functions",
          "methods": [
            {
              "textRaw": "dgram.createSocket(options[, callback])",
              "type": "method",
              "name": "createSocket",
              "signatures": [
                {
                  "return": {
                    "textRaw": "Returns: {dgram.Socket} ",
                    "name": "return",
                    "type": "dgram.Socket"
                  },
                  "params": [
                    {
                      "textRaw": "`options` {Object} ",
                      "name": "options",
                      "type": "Object"
                    },
                    {
                      "textRaw": "`callback` {Function} Attached as a listener to `'message'` events. ",
                      "name": "callback",
                      "type": "Function",
                      "desc": "Attached as a listener to `'message'` events.",
                      "optional": true
                    }
                  ]
                },
                {
                  "params": [
                    {
                      "name": "options"
                    },
                    {
                      "name": "callback",
                      "optional": true
                    }
                  ]
                }
              ],
              "desc": "<p>Creates a <code>dgram.Socket</code> object. The <code>options</code> argument is an object that\nshould contain a <code>type</code> field of either <code>udp4</code> or <code>udp6</code> and an optional\nboolean <code>reuseAddr</code> field.\n\n</p>\n<p>When <code>reuseAddr</code> is <code>true</code> [<code>socket.bind()</code>][] will reuse the address, even if\nanother process has already bound a socket on it. <code>reuseAddr</code> defaults to\n<code>false</code>. An optional <code>callback</code> function can be passed specified which is added\nas a listener for <code>&#39;message&#39;</code> events.\n\n</p>\n<p>Once the socket is created, calling [<code>socket.bind()</code>][] will instruct the\nsocket to begin listening for datagram messages. When <code>address</code> and <code>port</code> are\nnot passed to  [<code>socket.bind()</code>][] the method will bind the socket to the &quot;all\ninterfaces&quot; address on a random port (it does the right thing for both <code>udp4</code>\nand <code>udp6</code> sockets). The bound address and port can be retrieved using\n[<code>socket.address().address</code>][] and [<code>socket.address().port</code>][].\n\n</p>\n"
            },
            {
              "textRaw": "dgram.createSocket(type[, callback])",
              "type": "method",
              "name": "createSocket",
              "signatures": [
                {
                  "return": {
                    "textRaw": "Returns: {dgram.Socket} ",
                    "name": "return",
                    "type": "dgram.Socket"
                  },
                  "params": [
                    {
                      "textRaw": "`type` {String} - Either 'udp4' or 'udp6' ",
                      "name": "type",
                      "type": "String",
                      "desc": "Either 'udp4' or 'udp6'"
                    },
                    {
                      "textRaw": "`callback` {Function} - Attached as a listener to `'message'` events. Optional ",
                      "name": "callback",
                      "type": "Function",
                      "optional": true,
                      "desc": "Attached as a listener to `'message'` events."
                    }
                  ]
                },
                {
                  "params": [
                    {
                      "name": "type"
                    },
                    {
                      "name": "callback",
                      "optional": true
                    }
                  ]
                }
              ],
              "desc": "<p>Creates a <code>dgram.Socket</code> object of the specified <code>type</code>. The <code>type</code> argument\ncan be either <code>udp4</code> or <code>udp6</code>. An optional <code>callback</code> function can be passed\nwhich is added as a listener for <code>&#39;message&#39;</code> events.\n\n</p>\n<p>Once the socket is created, calling [<code>socket.bind()</code>][] will instruct the\nsocket to begin listening for datagram messages. When <code>address</code> and <code>port</code> are\nnot passed to  [<code>socket.bind()</code>][] the method will bind the socket to the &quot;all\ninterfaces&quot; address on a random port (it does the right thing for both <code>udp4</code>\nand <code>udp6</code> sockets). The bound address and port can be retrieved using\n[<code>socket.address().address</code>][] and [<code>socket.address().port</code>][].\n\n</p>\n"
            }
          ],
          "type": "module",
          "displayName": "`dgram` module functions"
        }
      ],
      "type": "module",
      "displayName": "dgram"
    }
  ]
}
