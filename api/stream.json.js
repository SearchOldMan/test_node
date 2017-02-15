{
  "source": "doc/api/stream.markdown",
  "modules": [
    {
      "textRaw": "Stream",
      "name": "stream",
      "stability": 2,
      "stabilityText": "Stable",
      "desc": "<p>A stream is an abstract interface implemented by various objects in\nNode.js. For example a [request to an HTTP server][http-incoming-message] is a\nstream, as is [<code>process.stdout</code>][]. Streams are readable, writable, or both. All\nstreams are instances of [<code>EventEmitter</code>][].\n\n</p>\n<p>You can load the Stream base classes by doing <code>require(&#39;stream&#39;)</code>.\nThere are base classes provided for [Readable][] streams, [Writable][]\nstreams, [Duplex][] streams, and [Transform][] streams.\n\n</p>\n<p>This document is split up into 3 sections:\n\n</p>\n<ol>\n<li>The first section explains the parts of the API that you need to be\naware of to use streams in your programs.</li>\n<li>The second section explains the parts of the API that you need to\nuse if you implement your own custom streams yourself. The API is designed to\nmake this easy for you to do.</li>\n<li>The third section goes into more depth about how streams work,\nincluding some of the internal mechanisms and functions that you\nshould probably not modify unless you definitely know what you are\ndoing.</li>\n</ol>\n",
      "classes": [
        {
          "textRaw": "Class: stream.Duplex",
          "type": "class",
          "name": "stream.Duplex",
          "desc": "<p>Duplex streams are streams that implement both the [Readable][] and\n[Writable][] interfaces.\n\n</p>\n<p>Examples of Duplex streams include:\n\n</p>\n<ul>\n<li>[TCP sockets][]</li>\n<li>[zlib streams][zlib]</li>\n<li>[crypto streams][crypto]</li>\n</ul>\n"
        },
        {
          "textRaw": "Class: stream.Readable",
          "type": "class",
          "name": "stream.Readable",
          "desc": "<p>The Readable stream interface is the abstraction for a <em>source</em> of\ndata that you are reading from. In other words, data comes <em>out</em> of a\nReadable stream.\n\n</p>\n<p>A Readable stream will not start emitting data until you indicate that\nyou are ready to receive it.\n\n</p>\n<p>Readable streams have two &quot;modes&quot;: a <strong>flowing mode</strong> and a <strong>paused\nmode</strong>. When in flowing mode, data is read from the underlying system\nand provided to your program as fast as possible. In paused mode, you\nmust explicitly call [<code>stream.read()</code>][stream-read] to get chunks of data out.\nStreams start out in paused mode.\n\n</p>\n<p><strong>Note</strong>: If no data event handlers are attached, and there are no\n[<code>stream.pipe()</code>][] destinations, and the stream is switched into flowing\nmode, then data will be lost.\n\n</p>\n<p>You can switch to flowing mode by doing any of the following:\n\n</p>\n<ul>\n<li>Adding a [<code>&#39;data&#39;</code>][] event handler to listen for data.</li>\n<li>Calling the [<code>stream.resume()</code>][stream-resume] method to explicitly open the\nflow.</li>\n<li>Calling the [<code>stream.pipe()</code>][] method to send the data to a [Writable][].</li>\n</ul>\n<p>You can switch back to paused mode by doing either of the following:\n\n</p>\n<ul>\n<li>If there are no pipe destinations, by calling the\n[<code>stream.pause()</code>][stream-pause] method.</li>\n<li>If there are pipe destinations, by removing any [<code>&#39;data&#39;</code>][] event\nhandlers, and removing all pipe destinations by calling the\n[<code>stream.unpipe()</code>][] method.</li>\n</ul>\n<p>Note that, for backwards compatibility reasons, removing [<code>&#39;data&#39;</code>][]\nevent handlers will <strong>not</strong> automatically pause the stream. Also, if\nthere are piped destinations, then calling [<code>stream.pause()</code>][stream-pause] will\nnot guarantee that the stream will <em>remain</em> paused once those\ndestinations drain and ask for more data.\n\n</p>\n<p>Examples of readable streams include:\n\n</p>\n<ul>\n<li>[HTTP responses, on the client][http-incoming-message]</li>\n<li>[HTTP requests, on the server][http-incoming-message]</li>\n<li>[fs read streams][]</li>\n<li>[zlib streams][zlib]</li>\n<li>[crypto streams][crypto]</li>\n<li>[TCP sockets][]</li>\n<li>[child process stdout and stderr][]</li>\n<li>[<code>process.stdin</code>][]</li>\n</ul>\n",
          "events": [
            {
              "textRaw": "Event: 'close'",
              "type": "event",
              "name": "close",
              "desc": "<p>Emitted when the stream and any of its underlying resources (a file\ndescriptor, for example) have been closed. The event indicates that\nno more events will be emitted, and no further computation will occur.\n\n</p>\n<p>Not all streams will emit the <code>&#39;close&#39;</code> event.\n\n</p>\n",
              "params": []
            },
            {
              "textRaw": "Event: 'data'",
              "type": "event",
              "name": "data",
              "params": [],
              "desc": "<p>Attaching a <code>&#39;data&#39;</code> event listener to a stream that has not been\nexplicitly paused will switch the stream into flowing mode. Data will\nthen be passed as soon as it is available.\n\n</p>\n<p>If you just want to get all the data out of the stream as fast as\npossible, this is the best way to do so.\n\n</p>\n<pre><code class=\"js\">var readable = getReadableStreamSomehow();\nreadable.on(&#39;data&#39;, (chunk) =&gt; {\n  console.log(&#39;got %d bytes of data&#39;, chunk.length);\n});</code></pre>\n"
            },
            {
              "textRaw": "Event: 'end'",
              "type": "event",
              "name": "end",
              "desc": "<p>This event fires when there will be no more data to read.\n\n</p>\n<p>Note that the <code>&#39;end&#39;</code> event <strong>will not fire</strong> unless the data is\ncompletely consumed. This can be done by switching into flowing mode,\nor by calling [<code>stream.read()</code>][stream-read] repeatedly until you get to the\nend.\n\n</p>\n<pre><code class=\"js\">var readable = getReadableStreamSomehow();\nreadable.on(&#39;data&#39;, (chunk) =&gt; {\n  console.log(&#39;got %d bytes of data&#39;, chunk.length);\n});\nreadable.on(&#39;end&#39;, () =&gt; {\n  console.log(&#39;there will be no more data.&#39;);\n});</code></pre>\n",
              "params": []
            },
            {
              "textRaw": "Event: 'error'",
              "type": "event",
              "name": "error",
              "params": [],
              "desc": "<p>Emitted if there was an error receiving data.\n\n</p>\n"
            },
            {
              "textRaw": "Event: 'readable'",
              "type": "event",
              "name": "readable",
              "desc": "<p>When a chunk of data can be read from the stream, it will emit a\n<code>&#39;readable&#39;</code> event.\n\n</p>\n<p>In some cases, listening for a <code>&#39;readable&#39;</code> event will cause some data\nto be read into the internal buffer from the underlying system, if it\nhadn&#39;t already.\n\n</p>\n<pre><code class=\"javascript\">var readable = getReadableStreamSomehow();\nreadable.on(&#39;readable&#39;, () =&gt; {\n  // there is some data to read now\n});</code></pre>\n<p>Once the internal buffer is drained, a <code>&#39;readable&#39;</code> event will fire\nagain when more data is available.\n\n</p>\n<p>The <code>&#39;readable&#39;</code> event is not emitted in the &quot;flowing&quot; mode with the\nsole exception of the last one, on end-of-stream.\n\n</p>\n<p>The <code>&#39;readable&#39;</code> event indicates that the stream has new information:\neither new data is available or the end of the stream has been reached.\nIn the former case, [<code>stream.read()</code>][stream-read] will return that data. In the\nlatter case, [<code>stream.read()</code>][stream-read] will return null. For instance, in\nthe following example, <code>foo.txt</code> is an empty file:\n\n</p>\n<pre><code class=\"js\">const fs = require(&#39;fs&#39;);\nvar rr = fs.createReadStream(&#39;foo.txt&#39;);\nrr.on(&#39;readable&#39;, () =&gt; {\n  console.log(&#39;readable:&#39;, rr.read());\n});\nrr.on(&#39;end&#39;, () =&gt; {\n  console.log(&#39;end&#39;);\n});</code></pre>\n<p>The output of running this script is:\n\n</p>\n<pre><code>$ node test.js\nreadable: null\nend</code></pre>\n",
              "params": []
            }
          ],
          "methods": [
            {
              "textRaw": "readable.isPaused()",
              "type": "method",
              "name": "isPaused",
              "signatures": [
                {
                  "return": {
                    "textRaw": "Return: {Boolean} ",
                    "name": "return",
                    "type": "Boolean"
                  },
                  "params": []
                },
                {
                  "params": []
                }
              ],
              "desc": "<p>This method returns whether or not the <code>readable</code> has been <strong>explicitly</strong>\npaused by client code (using [<code>stream.pause()</code>][stream-pause] without a\ncorresponding [<code>stream.resume()</code>][stream-resume]).\n\n</p>\n<pre><code class=\"js\">var readable = new stream.Readable\n\nreadable.isPaused() // === false\nreadable.pause()\nreadable.isPaused() // === true\nreadable.resume()\nreadable.isPaused() // === false</code></pre>\n"
            },
            {
              "textRaw": "readable.pause()",
              "type": "method",
              "name": "pause",
              "signatures": [
                {
                  "return": {
                    "textRaw": "Return: `this` ",
                    "name": "return",
                    "desc": "`this`"
                  },
                  "params": []
                },
                {
                  "params": []
                }
              ],
              "desc": "<p>This method will cause a stream in flowing mode to stop emitting\n[<code>&#39;data&#39;</code>][] events, switching out of flowing mode. Any data that becomes\navailable will remain in the internal buffer.\n\n</p>\n<pre><code class=\"js\">var readable = getReadableStreamSomehow();\nreadable.on(&#39;data&#39;, (chunk) =&gt; {\n  console.log(&#39;got %d bytes of data&#39;, chunk.length);\n  readable.pause();\n  console.log(&#39;there will be no more data for 1 second&#39;);\n  setTimeout(() =&gt; {\n    console.log(&#39;now data will start flowing again&#39;);\n    readable.resume();\n  }, 1000);\n});</code></pre>\n"
            },
            {
              "textRaw": "readable.pipe(destination[, options])",
              "type": "method",
              "name": "pipe",
              "signatures": [
                {
                  "params": [
                    {
                      "textRaw": "`destination` {stream.Writable} The destination for writing data ",
                      "name": "destination",
                      "type": "stream.Writable",
                      "desc": "The destination for writing data"
                    },
                    {
                      "textRaw": "`options` {Object} Pipe options ",
                      "options": [
                        {
                          "textRaw": "`end` {Boolean} End the writer when the reader ends. Default = `true` ",
                          "name": "end",
                          "type": "Boolean",
                          "desc": "End the writer when the reader ends. Default = `true`"
                        }
                      ],
                      "name": "options",
                      "type": "Object",
                      "desc": "Pipe options",
                      "optional": true
                    }
                  ]
                },
                {
                  "params": [
                    {
                      "name": "destination"
                    },
                    {
                      "name": "options",
                      "optional": true
                    }
                  ]
                }
              ],
              "desc": "<p>This method pulls all the data out of a readable stream, and writes it\nto the supplied destination, automatically managing the flow so that\nthe destination is not overwhelmed by a fast readable stream.\n\n</p>\n<p>Multiple destinations can be piped to safely.\n\n</p>\n<pre><code class=\"js\">var readable = getReadableStreamSomehow();\nvar writable = fs.createWriteStream(&#39;file.txt&#39;);\n// All the data from readable goes into &#39;file.txt&#39;\nreadable.pipe(writable);</code></pre>\n<p>This function returns the destination stream, so you can set up pipe\nchains like so:\n\n</p>\n<pre><code class=\"js\">var r = fs.createReadStream(&#39;file.txt&#39;);\nvar z = zlib.createGzip();\nvar w = fs.createWriteStream(&#39;file.txt.gz&#39;);\nr.pipe(z).pipe(w);</code></pre>\n<p>For example, emulating the Unix <code>cat</code> command:\n\n</p>\n<pre><code class=\"js\">process.stdin.pipe(process.stdout);</code></pre>\n<p>By default [<code>stream.end()</code>][stream-end] is called on the destination when the\nsource stream emits [<code>&#39;end&#39;</code>][], so that <code>destination</code> is no longer writable.\nPass <code>{ end: false }</code> as <code>options</code> to keep the destination stream open.\n\n</p>\n<p>This keeps <code>writer</code> open so that &quot;Goodbye&quot; can be written at the\nend.\n\n</p>\n<pre><code class=\"js\">reader.pipe(writer, { end: false });\nreader.on(&#39;end&#39;, () =&gt; {\n  writer.end(&#39;Goodbye\\n&#39;);\n});</code></pre>\n<p>Note that [<code>process.stderr</code>][] and [<code>process.stdout</code>][] are never closed until\nthe process exits, regardless of the specified options.\n\n</p>\n"
            },
            {
              "textRaw": "readable.read([size])",
              "type": "method",
              "name": "read",
              "signatures": [
                {
                  "return": {
                    "textRaw": "Return {String|Buffer|Null} ",
                    "name": "return",
                    "type": "String|Buffer|Null"
                  },
                  "params": [
                    {
                      "textRaw": "`size` {Number} Optional argument to specify how much data to read. ",
                      "name": "size",
                      "type": "Number",
                      "desc": "Optional argument to specify how much data to read.",
                      "optional": true
                    }
                  ]
                },
                {
                  "params": [
                    {
                      "name": "size",
                      "optional": true
                    }
                  ]
                }
              ],
              "desc": "<p>The <code>read()</code> method pulls some data out of the internal buffer and\nreturns it. If there is no data available, then it will return\n<code>null</code>.\n\n</p>\n<p>If you pass in a <code>size</code> argument, then it will return that many\nbytes. If <code>size</code> bytes are not available, then it will return <code>null</code>,\nunless we&#39;ve ended, in which case it will return the data remaining\nin the buffer.\n\n</p>\n<p>If you do not specify a <code>size</code> argument, then it will return all the\ndata in the internal buffer.\n\n</p>\n<p>This method should only be called in paused mode. In flowing mode,\nthis method is called automatically until the internal buffer is\ndrained.\n\n</p>\n<pre><code class=\"js\">var readable = getReadableStreamSomehow();\nreadable.on(&#39;readable&#39;, () =&gt; {\n  var chunk;\n  while (null !== (chunk = readable.read())) {\n    console.log(&#39;got %d bytes of data&#39;, chunk.length);\n  }\n});</code></pre>\n<p>If this method returns a data chunk, then it will also trigger the\nemission of a [<code>&#39;data&#39;</code>][] event.\n\n</p>\n<p>Note that calling [<code>stream.read([size])</code>][stream-read] after the [<code>&#39;end&#39;</code>][]\nevent has been triggered will return <code>null</code>. No runtime error will be raised.\n\n</p>\n"
            },
            {
              "textRaw": "readable.resume()",
              "type": "method",
              "name": "resume",
              "signatures": [
                {
                  "return": {
                    "textRaw": "Return: `this` ",
                    "name": "return",
                    "desc": "`this`"
                  },
                  "params": []
                },
                {
                  "params": []
                }
              ],
              "desc": "<p>This method will cause the readable stream to resume emitting [<code>&#39;data&#39;</code>][]\nevents.\n\n</p>\n<p>This method will switch the stream into flowing mode. If you do <em>not</em>\nwant to consume the data from a stream, but you <em>do</em> want to get to\nits [<code>&#39;end&#39;</code>][] event, you can call [<code>stream.resume()</code>][stream-resume] to open\nthe flow of data.\n\n</p>\n<pre><code class=\"js\">var readable = getReadableStreamSomehow();\nreadable.resume();\nreadable.on(&#39;end&#39;, () =&gt; {\n  console.log(&#39;got to the end, but did not read anything&#39;);\n});</code></pre>\n"
            },
            {
              "textRaw": "readable.setEncoding(encoding)",
              "type": "method",
              "name": "setEncoding",
              "signatures": [
                {
                  "return": {
                    "textRaw": "Return: `this` ",
                    "name": "return",
                    "desc": "`this`"
                  },
                  "params": [
                    {
                      "textRaw": "`encoding` {String} The encoding to use. ",
                      "name": "encoding",
                      "type": "String",
                      "desc": "The encoding to use."
                    }
                  ]
                },
                {
                  "params": [
                    {
                      "name": "encoding"
                    }
                  ]
                }
              ],
              "desc": "<p>Call this function to cause the stream to return strings of the specified\nencoding instead of Buffer objects. For example, if you do\n<code>readable.setEncoding(&#39;utf8&#39;)</code>, then the output data will be interpreted as\nUTF-8 data, and returned as strings. If you do <code>readable.setEncoding(&#39;hex&#39;)</code>,\nthen the data will be encoded in hexadecimal string format.\n\n</p>\n<p>This properly handles multi-byte characters that would otherwise be\npotentially mangled if you simply pulled the Buffers directly and\ncalled [<code>buf.toString(encoding)</code>][] on them. If you want to read the data\nas strings, always use this method.\n\n</p>\n<pre><code class=\"js\">var readable = getReadableStreamSomehow();\nreadable.setEncoding(&#39;utf8&#39;);\nreadable.on(&#39;data&#39;, (chunk) =&gt; {\n  assert.equal(typeof chunk, &#39;string&#39;);\n  console.log(&#39;got %d characters of string data&#39;, chunk.length);\n});</code></pre>\n"
            },
            {
              "textRaw": "readable.unpipe([destination])",
              "type": "method",
              "name": "unpipe",
              "signatures": [
                {
                  "params": [
                    {
                      "textRaw": "`destination` {stream.Writable} Optional specific stream to unpipe ",
                      "name": "destination",
                      "type": "stream.Writable",
                      "desc": "Optional specific stream to unpipe",
                      "optional": true
                    }
                  ]
                },
                {
                  "params": [
                    {
                      "name": "destination",
                      "optional": true
                    }
                  ]
                }
              ],
              "desc": "<p>This method will remove the hooks set up for a previous [<code>stream.pipe()</code>][]\ncall.\n\n</p>\n<p>If the destination is not specified, then all pipes are removed.\n\n</p>\n<p>If the destination is specified, but no pipe is set up for it, then\nthis is a no-op.\n\n</p>\n<pre><code class=\"js\">var readable = getReadableStreamSomehow();\nvar writable = fs.createWriteStream(&#39;file.txt&#39;);\n// All the data from readable goes into &#39;file.txt&#39;,\n// but only for the first second\nreadable.pipe(writable);\nsetTimeout(() =&gt; {\n  console.log(&#39;stop writing to file.txt&#39;);\n  readable.unpipe(writable);\n  console.log(&#39;manually close the file stream&#39;);\n  writable.end();\n}, 1000);</code></pre>\n"
            },
            {
              "textRaw": "readable.unshift(chunk)",
              "type": "method",
              "name": "unshift",
              "signatures": [
                {
                  "params": [
                    {
                      "textRaw": "`chunk` {Buffer|String} Chunk of data to unshift onto the read queue ",
                      "name": "chunk",
                      "type": "Buffer|String",
                      "desc": "Chunk of data to unshift onto the read queue"
                    }
                  ]
                },
                {
                  "params": [
                    {
                      "name": "chunk"
                    }
                  ]
                }
              ],
              "desc": "<p>This is useful in certain cases where a stream is being consumed by a\nparser, which needs to &quot;un-consume&quot; some data that it has\noptimistically pulled out of the source, so that the stream can be\npassed on to some other party.\n\n</p>\n<p>Note that <code>stream.unshift(chunk)</code> cannot be called after the [<code>&#39;end&#39;</code>][] event\nhas been triggered; a runtime error will be raised.\n\n</p>\n<p>If you find that you must often call <code>stream.unshift(chunk)</code> in your\nprograms, consider implementing a [Transform][] stream instead. (See [API\nfor Stream Implementors][].)\n\n</p>\n<pre><code class=\"js\">// Pull off a header delimited by \\n\\n\n// use unshift() if we get too much\n// Call the callback with (error, header, stream)\nconst StringDecoder = require(&#39;string_decoder&#39;).StringDecoder;\nfunction parseHeader(stream, callback) {\n  stream.on(&#39;error&#39;, callback);\n  stream.on(&#39;readable&#39;, onReadable);\n  var decoder = new StringDecoder(&#39;utf8&#39;);\n  var header = &#39;&#39;;\n  function onReadable() {\n    var chunk;\n    while (null !== (chunk = stream.read())) {\n      var str = decoder.write(chunk);\n      if (str.match(/\\n\\n/)) {\n        // found the header boundary\n        var split = str.split(/\\n\\n/);\n        header += split.shift();\n        var remaining = split.join(&#39;\\n\\n&#39;);\n        var buf = new Buffer(remaining, &#39;utf8&#39;);\n        if (buf.length)\n          stream.unshift(buf);\n        stream.removeListener(&#39;error&#39;, callback);\n        stream.removeListener(&#39;readable&#39;, onReadable);\n        // now the body of the message can be read from the stream.\n        callback(null, header, stream);\n      } else {\n        // still reading the header.\n        header += str;\n      }\n    }\n  }\n}</code></pre>\n<p>Note that, unlike [<code>stream.push(chunk)</code>][stream-push], <code>stream.unshift(chunk)</code>\nwill not end the reading process by resetting the internal reading state of the\nstream. This can cause unexpected results if <code>unshift()</code> is called during a\nread (i.e. from within a [<code>stream._read()</code>][stream-_read] implementation on a\ncustom stream). Following the call to <code>unshift()</code> with an immediate\n[<code>stream.push(&#39;&#39;)</code>][stream-push] will reset the reading state appropriately,\nhowever it is best to simply avoid calling <code>unshift()</code> while in the process of\nperforming a read.\n\n</p>\n"
            },
            {
              "textRaw": "readable.wrap(stream)",
              "type": "method",
              "name": "wrap",
              "signatures": [
                {
                  "params": [
                    {
                      "textRaw": "`stream` {Stream} An \"old style\" readable stream ",
                      "name": "stream",
                      "type": "Stream",
                      "desc": "An \"old style\" readable stream"
                    }
                  ]
                },
                {
                  "params": [
                    {
                      "name": "stream"
                    }
                  ]
                }
              ],
              "desc": "<p>Versions of Node.js prior to v0.10 had streams that did not implement the\nentire Streams API as it is today. (See [Compatibility][] for\nmore information.)\n\n</p>\n<p>If you are using an older Node.js library that emits [<code>&#39;data&#39;</code>][] events and\nhas a [<code>stream.pause()</code>][stream-pause] method that is advisory only, then you\ncan use the <code>wrap()</code> method to create a [Readable][] stream that uses the old\nstream as its data source.\n\n</p>\n<p>You will very rarely ever need to call this function, but it exists\nas a convenience for interacting with old Node.js programs and libraries.\n\n</p>\n<p>For example:\n\n</p>\n<pre><code class=\"js\">const OldReader = require(&#39;./old-api-module.js&#39;).OldReader;\nconst Readable = require(&#39;stream&#39;).Readable;\nconst oreader = new OldReader;\nconst myReader = new Readable().wrap(oreader);\n\nmyReader.on(&#39;readable&#39;, () =&gt; {\n  myReader.read(); // etc.\n});</code></pre>\n"
            }
          ]
        },
        {
          "textRaw": "Class: stream.Transform",
          "type": "class",
          "name": "stream.Transform",
          "desc": "<p>Transform streams are [Duplex][] streams where the output is in some way\ncomputed from the input. They implement both the [Readable][] and\n[Writable][] interfaces.\n\n</p>\n<p>Examples of Transform streams include:\n\n</p>\n<ul>\n<li>[zlib streams][zlib]</li>\n<li>[crypto streams][crypto]</li>\n</ul>\n"
        },
        {
          "textRaw": "Class: stream.Writable",
          "type": "class",
          "name": "stream.Writable",
          "desc": "<p>The Writable stream interface is an abstraction for a <em>destination</em>\nthat you are writing data <em>to</em>.\n\n</p>\n<p>Examples of writable streams include:\n\n</p>\n<ul>\n<li>[HTTP requests, on the client][]</li>\n<li>[HTTP responses, on the server][]</li>\n<li>[fs write streams][]</li>\n<li>[zlib streams][zlib]</li>\n<li>[crypto streams][crypto]</li>\n<li>[TCP sockets][]</li>\n<li>[child process stdin][]</li>\n<li>[<code>process.stdout</code>][], [<code>process.stderr</code>][]</li>\n</ul>\n",
          "events": [
            {
              "textRaw": "Event: 'drain'",
              "type": "event",
              "name": "drain",
              "desc": "<p>If a [<code>stream.write(chunk)</code>][stream-write] call returns <code>false</code>, then the\n<code>&#39;drain&#39;</code> event will indicate when it is appropriate to begin writing more data\nto the stream.\n\n</p>\n<pre><code class=\"js\">// Write the data to the supplied writable stream one million times.\n// Be attentive to back-pressure.\nfunction writeOneMillionTimes(writer, data, encoding, callback) {\n  var i = 1000000;\n  write();\n  function write() {\n    var ok = true;\n    do {\n      i -= 1;\n      if (i === 0) {\n        // last time!\n        writer.write(data, encoding, callback);\n      } else {\n        // see if we should continue, or wait\n        // don&#39;t pass the callback, because we&#39;re not done yet.\n        ok = writer.write(data, encoding);\n      }\n    } while (i &gt; 0 &amp;&amp; ok);\n    if (i &gt; 0) {\n      // had to stop early!\n      // write some more once it drains\n      writer.once(&#39;drain&#39;, write);\n    }\n  }\n}</code></pre>\n",
              "params": []
            },
            {
              "textRaw": "Event: 'error'",
              "type": "event",
              "name": "error",
              "params": [],
              "desc": "<p>Emitted if there was an error when writing or piping data.\n\n</p>\n"
            },
            {
              "textRaw": "Event: 'finish'",
              "type": "event",
              "name": "finish",
              "desc": "<p>When the [<code>stream.end()</code>][stream-end] method has been called, and all data has\nbeen flushed to the underlying system, this event is emitted.\n\n</p>\n<pre><code class=\"javascript\">var writer = getWritableStreamSomehow();\nfor (var i = 0; i &lt; 100; i ++) {\n  writer.write(&#39;hello, #${i}!\\n&#39;);\n}\nwriter.end(&#39;this is the end\\n&#39;);\nwriter.on(&#39;finish&#39;, () =&gt; {\n  console.error(&#39;all writes are now complete.&#39;);\n});</code></pre>\n",
              "params": []
            },
            {
              "textRaw": "Event: 'pipe'",
              "type": "event",
              "name": "pipe",
              "params": [],
              "desc": "<p>This is emitted whenever the [<code>stream.pipe()</code>][] method is called on a readable\nstream, adding this writable to its set of destinations.\n\n</p>\n<pre><code class=\"js\">var writer = getWritableStreamSomehow();\nvar reader = getReadableStreamSomehow();\nwriter.on(&#39;pipe&#39;, (src) =&gt; {\n  console.error(&#39;something is piping into the writer&#39;);\n  assert.equal(src, reader);\n});\nreader.pipe(writer);</code></pre>\n"
            },
            {
              "textRaw": "Event: 'unpipe'",
              "type": "event",
              "name": "unpipe",
              "params": [],
              "desc": "<p>This is emitted whenever the [<code>stream.unpipe()</code>][] method is called on a\nreadable stream, removing this writable from its set of destinations.\n\n</p>\n<pre><code class=\"js\">var writer = getWritableStreamSomehow();\nvar reader = getReadableStreamSomehow();\nwriter.on(&#39;unpipe&#39;, (src) =&gt; {\n  console.error(&#39;something has stopped piping into the writer&#39;);\n  assert.equal(src, reader);\n});\nreader.pipe(writer);\nreader.unpipe(writer);</code></pre>\n"
            }
          ],
          "methods": [
            {
              "textRaw": "writable.cork()",
              "type": "method",
              "name": "cork",
              "desc": "<p>Forces buffering of all writes.\n\n</p>\n<p>Buffered data will be flushed either at [<code>stream.uncork()</code>][] or at\n[<code>stream.end()</code>][stream-end] call.\n\n</p>\n",
              "signatures": [
                {
                  "params": []
                }
              ]
            },
            {
              "textRaw": "writable.end([chunk][, encoding][, callback])",
              "type": "method",
              "name": "end",
              "signatures": [
                {
                  "params": [
                    {
                      "textRaw": "`chunk` {String|Buffer} Optional data to write ",
                      "name": "chunk",
                      "type": "String|Buffer",
                      "desc": "Optional data to write",
                      "optional": true
                    },
                    {
                      "textRaw": "`encoding` {String} The encoding, if `chunk` is a String ",
                      "name": "encoding",
                      "type": "String",
                      "desc": "The encoding, if `chunk` is a String",
                      "optional": true
                    },
                    {
                      "textRaw": "`callback` {Function} Optional callback for when the stream is finished ",
                      "name": "callback",
                      "type": "Function",
                      "desc": "Optional callback for when the stream is finished",
                      "optional": true
                    }
                  ]
                },
                {
                  "params": [
                    {
                      "name": "chunk",
                      "optional": true
                    },
                    {
                      "name": "encoding",
                      "optional": true
                    },
                    {
                      "name": "callback",
                      "optional": true
                    }
                  ]
                }
              ],
              "desc": "<p>Call this method when no more data will be written to the stream. If supplied,\nthe callback is attached as a listener on the [<code>&#39;finish&#39;</code>][] event.\n\n</p>\n<p>Calling [<code>stream.write()</code>][stream-write] after calling\n[<code>stream.end()</code>][stream-end] will raise an error.\n\n</p>\n<pre><code class=\"js\">// write &#39;hello, &#39; and then end with &#39;world!&#39;\nvar file = fs.createWriteStream(&#39;example.txt&#39;);\nfile.write(&#39;hello, &#39;);\nfile.end(&#39;world!&#39;);\n// writing more now is not allowed!</code></pre>\n"
            },
            {
              "textRaw": "writable.setDefaultEncoding(encoding)",
              "type": "method",
              "name": "setDefaultEncoding",
              "signatures": [
                {
                  "params": [
                    {
                      "textRaw": "`encoding` {String} The new default encoding ",
                      "name": "encoding",
                      "type": "String",
                      "desc": "The new default encoding"
                    }
                  ]
                },
                {
                  "params": [
                    {
                      "name": "encoding"
                    }
                  ]
                }
              ],
              "desc": "<p>Sets the default encoding for a writable stream.\n\n</p>\n"
            },
            {
              "textRaw": "writable.uncork()",
              "type": "method",
              "name": "uncork",
              "desc": "<p>Flush all data, buffered since [<code>stream.cork()</code>][] call.\n\n</p>\n",
              "signatures": [
                {
                  "params": []
                }
              ]
            },
            {
              "textRaw": "writable.write(chunk[, encoding][, callback])",
              "type": "method",
              "name": "write",
              "signatures": [
                {
                  "return": {
                    "textRaw": "Returns: {Boolean} `true` if the data was handled completely. ",
                    "name": "return",
                    "type": "Boolean",
                    "desc": "`true` if the data was handled completely."
                  },
                  "params": [
                    {
                      "textRaw": "`chunk` {String|Buffer} The data to write ",
                      "name": "chunk",
                      "type": "String|Buffer",
                      "desc": "The data to write"
                    },
                    {
                      "textRaw": "`encoding` {String} The encoding, if `chunk` is a String ",
                      "name": "encoding",
                      "type": "String",
                      "desc": "The encoding, if `chunk` is a String",
                      "optional": true
                    },
                    {
                      "textRaw": "`callback` {Function} Callback for when this chunk of data is flushed ",
                      "name": "callback",
                      "type": "Function",
                      "desc": "Callback for when this chunk of data is flushed",
                      "optional": true
                    }
                  ]
                },
                {
                  "params": [
                    {
                      "name": "chunk"
                    },
                    {
                      "name": "encoding",
                      "optional": true
                    },
                    {
                      "name": "callback",
                      "optional": true
                    }
                  ]
                }
              ],
              "desc": "<p>This method writes some data to the underlying system, and calls the\nsupplied callback once the data has been fully handled.\n\n</p>\n<p>The return value indicates if you should continue writing right now.\nIf the data had to be buffered internally, then it will return\n<code>false</code>. Otherwise, it will return <code>true</code>.\n\n</p>\n<p>This return value is strictly advisory. You MAY continue to write,\neven if it returns <code>false</code>. However, writes will be buffered in\nmemory, so it is best not to do this excessively. Instead, wait for\nthe [<code>&#39;drain&#39;</code>][] event before writing more data.\n\n\n</p>\n"
            }
          ]
        }
      ],
      "miscs": [
        {
          "textRaw": "API for Stream Consumers",
          "name": "API for Stream Consumers",
          "type": "misc",
          "desc": "<p>Streams can be either [Readable][], [Writable][], or both ([Duplex][]).\n\n</p>\n<p>All streams are EventEmitters, but they also have other custom methods\nand properties depending on whether they are Readable, Writable, or\nDuplex.\n\n</p>\n<p>If a stream is both Readable and Writable, then it implements all of\nthe methods and events. So, a [Duplex][] or [Transform][] stream is\nfully described by this API, though their implementation may be\nsomewhat different.\n\n</p>\n<p>It is not necessary to implement Stream interfaces in order to consume\nstreams in your programs. If you <strong>are</strong> implementing streaming\ninterfaces in your own program, please also refer to\n[API for Stream Implementors][].\n\n</p>\n<p>Almost all Node.js programs, no matter how simple, use Streams in some\nway. Here is an example of using Streams in an Node.js program:\n\n</p>\n<pre><code class=\"js\">const http = require(&#39;http&#39;);\n\nvar server = http.createServer( (req, res) =&gt; {\n  // req is an http.IncomingMessage, which is a Readable Stream\n  // res is an http.ServerResponse, which is a Writable Stream\n\n  var body = &#39;&#39;;\n  // we want to get the data as utf8 strings\n  // If you don&#39;t set an encoding, then you&#39;ll get Buffer objects\n  req.setEncoding(&#39;utf8&#39;);\n\n  // Readable streams emit &#39;data&#39; events once a listener is added\n  req.on(&#39;data&#39;, (chunk) =&gt; {\n    body += chunk;\n  });\n\n  // the end event tells you that you have entire body\n  req.on(&#39;end&#39;, () =&gt; {\n    try {\n      var data = JSON.parse(body);\n    } catch (er) {\n      // uh oh!  bad json!\n      res.statusCode = 400;\n      return res.end(`error: ${er.message}`);\n    }\n\n    // write back something interesting to the user:\n    res.write(typeof data);\n    res.end();\n  });\n});\n\nserver.listen(1337);\n\n// $ curl localhost:1337 -d &#39;{}&#39;\n// object\n// $ curl localhost:1337 -d &#39;&quot;foo&quot;&#39;\n// string\n// $ curl localhost:1337 -d &#39;not json&#39;\n// error: Unexpected token o</code></pre>\n",
          "classes": [
            {
              "textRaw": "Class: stream.Duplex",
              "type": "class",
              "name": "stream.Duplex",
              "desc": "<p>Duplex streams are streams that implement both the [Readable][] and\n[Writable][] interfaces.\n\n</p>\n<p>Examples of Duplex streams include:\n\n</p>\n<ul>\n<li>[TCP sockets][]</li>\n<li>[zlib streams][zlib]</li>\n<li>[crypto streams][crypto]</li>\n</ul>\n"
            },
            {
              "textRaw": "Class: stream.Readable",
              "type": "class",
              "name": "stream.Readable",
              "desc": "<p>The Readable stream interface is the abstraction for a <em>source</em> of\ndata that you are reading from. In other words, data comes <em>out</em> of a\nReadable stream.\n\n</p>\n<p>A Readable stream will not start emitting data until you indicate that\nyou are ready to receive it.\n\n</p>\n<p>Readable streams have two &quot;modes&quot;: a <strong>flowing mode</strong> and a <strong>paused\nmode</strong>. When in flowing mode, data is read from the underlying system\nand provided to your program as fast as possible. In paused mode, you\nmust explicitly call [<code>stream.read()</code>][stream-read] to get chunks of data out.\nStreams start out in paused mode.\n\n</p>\n<p><strong>Note</strong>: If no data event handlers are attached, and there are no\n[<code>stream.pipe()</code>][] destinations, and the stream is switched into flowing\nmode, then data will be lost.\n\n</p>\n<p>You can switch to flowing mode by doing any of the following:\n\n</p>\n<ul>\n<li>Adding a [<code>&#39;data&#39;</code>][] event handler to listen for data.</li>\n<li>Calling the [<code>stream.resume()</code>][stream-resume] method to explicitly open the\nflow.</li>\n<li>Calling the [<code>stream.pipe()</code>][] method to send the data to a [Writable][].</li>\n</ul>\n<p>You can switch back to paused mode by doing either of the following:\n\n</p>\n<ul>\n<li>If there are no pipe destinations, by calling the\n[<code>stream.pause()</code>][stream-pause] method.</li>\n<li>If there are pipe destinations, by removing any [<code>&#39;data&#39;</code>][] event\nhandlers, and removing all pipe destinations by calling the\n[<code>stream.unpipe()</code>][] method.</li>\n</ul>\n<p>Note that, for backwards compatibility reasons, removing [<code>&#39;data&#39;</code>][]\nevent handlers will <strong>not</strong> automatically pause the stream. Also, if\nthere are piped destinations, then calling [<code>stream.pause()</code>][stream-pause] will\nnot guarantee that the stream will <em>remain</em> paused once those\ndestinations drain and ask for more data.\n\n</p>\n<p>Examples of readable streams include:\n\n</p>\n<ul>\n<li>[HTTP responses, on the client][http-incoming-message]</li>\n<li>[HTTP requests, on the server][http-incoming-message]</li>\n<li>[fs read streams][]</li>\n<li>[zlib streams][zlib]</li>\n<li>[crypto streams][crypto]</li>\n<li>[TCP sockets][]</li>\n<li>[child process stdout and stderr][]</li>\n<li>[<code>process.stdin</code>][]</li>\n</ul>\n",
              "events": [
                {
                  "textRaw": "Event: 'close'",
                  "type": "event",
                  "name": "close",
                  "desc": "<p>Emitted when the stream and any of its underlying resources (a file\ndescriptor, for example) have been closed. The event indicates that\nno more events will be emitted, and no further computation will occur.\n\n</p>\n<p>Not all streams will emit the <code>&#39;close&#39;</code> event.\n\n</p>\n",
                  "params": []
                },
                {
                  "textRaw": "Event: 'data'",
                  "type": "event",
                  "name": "data",
                  "params": [],
                  "desc": "<p>Attaching a <code>&#39;data&#39;</code> event listener to a stream that has not been\nexplicitly paused will switch the stream into flowing mode. Data will\nthen be passed as soon as it is available.\n\n</p>\n<p>If you just want to get all the data out of the stream as fast as\npossible, this is the best way to do so.\n\n</p>\n<pre><code class=\"js\">var readable = getReadableStreamSomehow();\nreadable.on(&#39;data&#39;, (chunk) =&gt; {\n  console.log(&#39;got %d bytes of data&#39;, chunk.length);\n});</code></pre>\n"
                },
                {
                  "textRaw": "Event: 'end'",
                  "type": "event",
                  "name": "end",
                  "desc": "<p>This event fires when there will be no more data to read.\n\n</p>\n<p>Note that the <code>&#39;end&#39;</code> event <strong>will not fire</strong> unless the data is\ncompletely consumed. This can be done by switching into flowing mode,\nor by calling [<code>stream.read()</code>][stream-read] repeatedly until you get to the\nend.\n\n</p>\n<pre><code class=\"js\">var readable = getReadableStreamSomehow();\nreadable.on(&#39;data&#39;, (chunk) =&gt; {\n  console.log(&#39;got %d bytes of data&#39;, chunk.length);\n});\nreadable.on(&#39;end&#39;, () =&gt; {\n  console.log(&#39;there will be no more data.&#39;);\n});</code></pre>\n",
                  "params": []
                },
                {
                  "textRaw": "Event: 'error'",
                  "type": "event",
                  "name": "error",
                  "params": [],
                  "desc": "<p>Emitted if there was an error receiving data.\n\n</p>\n"
                },
                {
                  "textRaw": "Event: 'readable'",
                  "type": "event",
                  "name": "readable",
                  "desc": "<p>When a chunk of data can be read from the stream, it will emit a\n<code>&#39;readable&#39;</code> event.\n\n</p>\n<p>In some cases, listening for a <code>&#39;readable&#39;</code> event will cause some data\nto be read into the internal buffer from the underlying system, if it\nhadn&#39;t already.\n\n</p>\n<pre><code class=\"javascript\">var readable = getReadableStreamSomehow();\nreadable.on(&#39;readable&#39;, () =&gt; {\n  // there is some data to read now\n});</code></pre>\n<p>Once the internal buffer is drained, a <code>&#39;readable&#39;</code> event will fire\nagain when more data is available.\n\n</p>\n<p>The <code>&#39;readable&#39;</code> event is not emitted in the &quot;flowing&quot; mode with the\nsole exception of the last one, on end-of-stream.\n\n</p>\n<p>The <code>&#39;readable&#39;</code> event indicates that the stream has new information:\neither new data is available or the end of the stream has been reached.\nIn the former case, [<code>stream.read()</code>][stream-read] will return that data. In the\nlatter case, [<code>stream.read()</code>][stream-read] will return null. For instance, in\nthe following example, <code>foo.txt</code> is an empty file:\n\n</p>\n<pre><code class=\"js\">const fs = require(&#39;fs&#39;);\nvar rr = fs.createReadStream(&#39;foo.txt&#39;);\nrr.on(&#39;readable&#39;, () =&gt; {\n  console.log(&#39;readable:&#39;, rr.read());\n});\nrr.on(&#39;end&#39;, () =&gt; {\n  console.log(&#39;end&#39;);\n});</code></pre>\n<p>The output of running this script is:\n\n</p>\n<pre><code>$ node test.js\nreadable: null\nend</code></pre>\n",
                  "params": []
                }
              ],
              "methods": [
                {
                  "textRaw": "readable.isPaused()",
                  "type": "method",
                  "name": "isPaused",
                  "signatures": [
                    {
                      "return": {
                        "textRaw": "Return: {Boolean} ",
                        "name": "return",
                        "type": "Boolean"
                      },
                      "params": []
                    },
                    {
                      "params": []
                    }
                  ],
                  "desc": "<p>This method returns whether or not the <code>readable</code> has been <strong>explicitly</strong>\npaused by client code (using [<code>stream.pause()</code>][stream-pause] without a\ncorresponding [<code>stream.resume()</code>][stream-resume]).\n\n</p>\n<pre><code class=\"js\">var readable = new stream.Readable\n\nreadable.isPaused() // === false\nreadable.pause()\nreadable.isPaused() // === true\nreadable.resume()\nreadable.isPaused() // === false</code></pre>\n"
                },
                {
                  "textRaw": "readable.pause()",
                  "type": "method",
                  "name": "pause",
                  "signatures": [
                    {
                      "return": {
                        "textRaw": "Return: `this` ",
                        "name": "return",
                        "desc": "`this`"
                      },
                      "params": []
                    },
                    {
                      "params": []
                    }
                  ],
                  "desc": "<p>This method will cause a stream in flowing mode to stop emitting\n[<code>&#39;data&#39;</code>][] events, switching out of flowing mode. Any data that becomes\navailable will remain in the internal buffer.\n\n</p>\n<pre><code class=\"js\">var readable = getReadableStreamSomehow();\nreadable.on(&#39;data&#39;, (chunk) =&gt; {\n  console.log(&#39;got %d bytes of data&#39;, chunk.length);\n  readable.pause();\n  console.log(&#39;there will be no more data for 1 second&#39;);\n  setTimeout(() =&gt; {\n    console.log(&#39;now data will start flowing again&#39;);\n    readable.resume();\n  }, 1000);\n});</code></pre>\n"
                },
                {
                  "textRaw": "readable.pipe(destination[, options])",
                  "type": "method",
                  "name": "pipe",
                  "signatures": [
                    {
                      "params": [
                        {
                          "textRaw": "`destination` {stream.Writable} The destination for writing data ",
                          "name": "destination",
                          "type": "stream.Writable",
                          "desc": "The destination for writing data"
                        },
                        {
                          "textRaw": "`options` {Object} Pipe options ",
                          "options": [
                            {
                              "textRaw": "`end` {Boolean} End the writer when the reader ends. Default = `true` ",
                              "name": "end",
                              "type": "Boolean",
                              "desc": "End the writer when the reader ends. Default = `true`"
                            }
                          ],
                          "name": "options",
                          "type": "Object",
                          "desc": "Pipe options",
                          "optional": true
                        }
                      ]
                    },
                    {
                      "params": [
                        {
                          "name": "destination"
                        },
                        {
                          "name": "options",
                          "optional": true
                        }
                      ]
                    }
                  ],
                  "desc": "<p>This method pulls all the data out of a readable stream, and writes it\nto the supplied destination, automatically managing the flow so that\nthe destination is not overwhelmed by a fast readable stream.\n\n</p>\n<p>Multiple destinations can be piped to safely.\n\n</p>\n<pre><code class=\"js\">var readable = getReadableStreamSomehow();\nvar writable = fs.createWriteStream(&#39;file.txt&#39;);\n// All the data from readable goes into &#39;file.txt&#39;\nreadable.pipe(writable);</code></pre>\n<p>This function returns the destination stream, so you can set up pipe\nchains like so:\n\n</p>\n<pre><code class=\"js\">var r = fs.createReadStream(&#39;file.txt&#39;);\nvar z = zlib.createGzip();\nvar w = fs.createWriteStream(&#39;file.txt.gz&#39;);\nr.pipe(z).pipe(w);</code></pre>\n<p>For example, emulating the Unix <code>cat</code> command:\n\n</p>\n<pre><code class=\"js\">process.stdin.pipe(process.stdout);</code></pre>\n<p>By default [<code>stream.end()</code>][stream-end] is called on the destination when the\nsource stream emits [<code>&#39;end&#39;</code>][], so that <code>destination</code> is no longer writable.\nPass <code>{ end: false }</code> as <code>options</code> to keep the destination stream open.\n\n</p>\n<p>This keeps <code>writer</code> open so that &quot;Goodbye&quot; can be written at the\nend.\n\n</p>\n<pre><code class=\"js\">reader.pipe(writer, { end: false });\nreader.on(&#39;end&#39;, () =&gt; {\n  writer.end(&#39;Goodbye\\n&#39;);\n});</code></pre>\n<p>Note that [<code>process.stderr</code>][] and [<code>process.stdout</code>][] are never closed until\nthe process exits, regardless of the specified options.\n\n</p>\n"
                },
                {
                  "textRaw": "readable.read([size])",
                  "type": "method",
                  "name": "read",
                  "signatures": [
                    {
                      "return": {
                        "textRaw": "Return {String|Buffer|Null} ",
                        "name": "return",
                        "type": "String|Buffer|Null"
                      },
                      "params": [
                        {
                          "textRaw": "`size` {Number} Optional argument to specify how much data to read. ",
                          "name": "size",
                          "type": "Number",
                          "desc": "Optional argument to specify how much data to read.",
                          "optional": true
                        }
                      ]
                    },
                    {
                      "params": [
                        {
                          "name": "size",
                          "optional": true
                        }
                      ]
                    }
                  ],
                  "desc": "<p>The <code>read()</code> method pulls some data out of the internal buffer and\nreturns it. If there is no data available, then it will return\n<code>null</code>.\n\n</p>\n<p>If you pass in a <code>size</code> argument, then it will return that many\nbytes. If <code>size</code> bytes are not available, then it will return <code>null</code>,\nunless we&#39;ve ended, in which case it will return the data remaining\nin the buffer.\n\n</p>\n<p>If you do not specify a <code>size</code> argument, then it will return all the\ndata in the internal buffer.\n\n</p>\n<p>This method should only be called in paused mode. In flowing mode,\nthis method is called automatically until the internal buffer is\ndrained.\n\n</p>\n<pre><code class=\"js\">var readable = getReadableStreamSomehow();\nreadable.on(&#39;readable&#39;, () =&gt; {\n  var chunk;\n  while (null !== (chunk = readable.read())) {\n    console.log(&#39;got %d bytes of data&#39;, chunk.length);\n  }\n});</code></pre>\n<p>If this method returns a data chunk, then it will also trigger the\nemission of a [<code>&#39;data&#39;</code>][] event.\n\n</p>\n<p>Note that calling [<code>stream.read([size])</code>][stream-read] after the [<code>&#39;end&#39;</code>][]\nevent has been triggered will return <code>null</code>. No runtime error will be raised.\n\n</p>\n"
                },
                {
                  "textRaw": "readable.resume()",
                  "type": "method",
                  "name": "resume",
                  "signatures": [
                    {
                      "return": {
                        "textRaw": "Return: `this` ",
                        "name": "return",
                        "desc": "`this`"
                      },
                      "params": []
                    },
                    {
                      "params": []
                    }
                  ],
                  "desc": "<p>This method will cause the readable stream to resume emitting [<code>&#39;data&#39;</code>][]\nevents.\n\n</p>\n<p>This method will switch the stream into flowing mode. If you do <em>not</em>\nwant to consume the data from a stream, but you <em>do</em> want to get to\nits [<code>&#39;end&#39;</code>][] event, you can call [<code>stream.resume()</code>][stream-resume] to open\nthe flow of data.\n\n</p>\n<pre><code class=\"js\">var readable = getReadableStreamSomehow();\nreadable.resume();\nreadable.on(&#39;end&#39;, () =&gt; {\n  console.log(&#39;got to the end, but did not read anything&#39;);\n});</code></pre>\n"
                },
                {
                  "textRaw": "readable.setEncoding(encoding)",
                  "type": "method",
                  "name": "setEncoding",
                  "signatures": [
                    {
                      "return": {
                        "textRaw": "Return: `this` ",
                        "name": "return",
                        "desc": "`this`"
                      },
                      "params": [
                        {
                          "textRaw": "`encoding` {String} The encoding to use. ",
                          "name": "encoding",
                          "type": "String",
                          "desc": "The encoding to use."
                        }
                      ]
                    },
                    {
                      "params": [
                        {
                          "name": "encoding"
                        }
                      ]
                    }
                  ],
                  "desc": "<p>Call this function to cause the stream to return strings of the specified\nencoding instead of Buffer objects. For example, if you do\n<code>readable.setEncoding(&#39;utf8&#39;)</code>, then the output data will be interpreted as\nUTF-8 data, and returned as strings. If you do <code>readable.setEncoding(&#39;hex&#39;)</code>,\nthen the data will be encoded in hexadecimal string format.\n\n</p>\n<p>This properly handles multi-byte characters that would otherwise be\npotentially mangled if you simply pulled the Buffers directly and\ncalled [<code>buf.toString(encoding)</code>][] on them. If you want to read the data\nas strings, always use this method.\n\n</p>\n<pre><code class=\"js\">var readable = getReadableStreamSomehow();\nreadable.setEncoding(&#39;utf8&#39;);\nreadable.on(&#39;data&#39;, (chunk) =&gt; {\n  assert.equal(typeof chunk, &#39;string&#39;);\n  console.log(&#39;got %d characters of string data&#39;, chunk.length);\n});</code></pre>\n"
                },
                {
                  "textRaw": "readable.unpipe([destination])",
                  "type": "method",
                  "name": "unpipe",
                  "signatures": [
                    {
                      "params": [
                        {
                          "textRaw": "`destination` {stream.Writable} Optional specific stream to unpipe ",
                          "name": "destination",
                          "type": "stream.Writable",
                          "desc": "Optional specific stream to unpipe",
                          "optional": true
                        }
                      ]
                    },
                    {
                      "params": [
                        {
                          "name": "destination",
                          "optional": true
                        }
                      ]
                    }
                  ],
                  "desc": "<p>This method will remove the hooks set up for a previous [<code>stream.pipe()</code>][]\ncall.\n\n</p>\n<p>If the destination is not specified, then all pipes are removed.\n\n</p>\n<p>If the destination is specified, but no pipe is set up for it, then\nthis is a no-op.\n\n</p>\n<pre><code class=\"js\">var readable = getReadableStreamSomehow();\nvar writable = fs.createWriteStream(&#39;file.txt&#39;);\n// All the data from readable goes into &#39;file.txt&#39;,\n// but only for the first second\nreadable.pipe(writable);\nsetTimeout(() =&gt; {\n  console.log(&#39;stop writing to file.txt&#39;);\n  readable.unpipe(writable);\n  console.log(&#39;manually close the file stream&#39;);\n  writable.end();\n}, 1000);</code></pre>\n"
                },
                {
                  "textRaw": "readable.unshift(chunk)",
                  "type": "method",
                  "name": "unshift",
                  "signatures": [
                    {
                      "params": [
                        {
                          "textRaw": "`chunk` {Buffer|String} Chunk of data to unshift onto the read queue ",
                          "name": "chunk",
                          "type": "Buffer|String",
                          "desc": "Chunk of data to unshift onto the read queue"
                        }
                      ]
                    },
                    {
                      "params": [
                        {
                          "name": "chunk"
                        }
                      ]
                    }
                  ],
                  "desc": "<p>This is useful in certain cases where a stream is being consumed by a\nparser, which needs to &quot;un-consume&quot; some data that it has\noptimistically pulled out of the source, so that the stream can be\npassed on to some other party.\n\n</p>\n<p>Note that <code>stream.unshift(chunk)</code> cannot be called after the [<code>&#39;end&#39;</code>][] event\nhas been triggered; a runtime error will be raised.\n\n</p>\n<p>If you find that you must often call <code>stream.unshift(chunk)</code> in your\nprograms, consider implementing a [Transform][] stream instead. (See [API\nfor Stream Implementors][].)\n\n</p>\n<pre><code class=\"js\">// Pull off a header delimited by \\n\\n\n// use unshift() if we get too much\n// Call the callback with (error, header, stream)\nconst StringDecoder = require(&#39;string_decoder&#39;).StringDecoder;\nfunction parseHeader(stream, callback) {\n  stream.on(&#39;error&#39;, callback);\n  stream.on(&#39;readable&#39;, onReadable);\n  var decoder = new StringDecoder(&#39;utf8&#39;);\n  var header = &#39;&#39;;\n  function onReadable() {\n    var chunk;\n    while (null !== (chunk = stream.read())) {\n      var str = decoder.write(chunk);\n      if (str.match(/\\n\\n/)) {\n        // found the header boundary\n        var split = str.split(/\\n\\n/);\n        header += split.shift();\n        var remaining = split.join(&#39;\\n\\n&#39;);\n        var buf = new Buffer(remaining, &#39;utf8&#39;);\n        if (buf.length)\n          stream.unshift(buf);\n        stream.removeListener(&#39;error&#39;, callback);\n        stream.removeListener(&#39;readable&#39;, onReadable);\n        // now the body of the message can be read from the stream.\n        callback(null, header, stream);\n      } else {\n        // still reading the header.\n        header += str;\n      }\n    }\n  }\n}</code></pre>\n<p>Note that, unlike [<code>stream.push(chunk)</code>][stream-push], <code>stream.unshift(chunk)</code>\nwill not end the reading process by resetting the internal reading state of the\nstream. This can cause unexpected results if <code>unshift()</code> is called during a\nread (i.e. from within a [<code>stream._read()</code>][stream-_read] implementation on a\ncustom stream). Following the call to <code>unshift()</code> with an immediate\n[<code>stream.push(&#39;&#39;)</code>][stream-push] will reset the reading state appropriately,\nhowever it is best to simply avoid calling <code>unshift()</code> while in the process of\nperforming a read.\n\n</p>\n"
                },
                {
                  "textRaw": "readable.wrap(stream)",
                  "type": "method",
                  "name": "wrap",
                  "signatures": [
                    {
                      "params": [
                        {
                          "textRaw": "`stream` {Stream} An \"old style\" readable stream ",
                          "name": "stream",
                          "type": "Stream",
                          "desc": "An \"old style\" readable stream"
                        }
                      ]
                    },
                    {
                      "params": [
                        {
                          "name": "stream"
                        }
                      ]
                    }
                  ],
                  "desc": "<p>Versions of Node.js prior to v0.10 had streams that did not implement the\nentire Streams API as it is today. (See [Compatibility][] for\nmore information.)\n\n</p>\n<p>If you are using an older Node.js library that emits [<code>&#39;data&#39;</code>][] events and\nhas a [<code>stream.pause()</code>][stream-pause] method that is advisory only, then you\ncan use the <code>wrap()</code> method to create a [Readable][] stream that uses the old\nstream as its data source.\n\n</p>\n<p>You will very rarely ever need to call this function, but it exists\nas a convenience for interacting with old Node.js programs and libraries.\n\n</p>\n<p>For example:\n\n</p>\n<pre><code class=\"js\">const OldReader = require(&#39;./old-api-module.js&#39;).OldReader;\nconst Readable = require(&#39;stream&#39;).Readable;\nconst oreader = new OldReader;\nconst myReader = new Readable().wrap(oreader);\n\nmyReader.on(&#39;readable&#39;, () =&gt; {\n  myReader.read(); // etc.\n});</code></pre>\n"
                }
              ]
            },
            {
              "textRaw": "Class: stream.Transform",
              "type": "class",
              "name": "stream.Transform",
              "desc": "<p>Transform streams are [Duplex][] streams where the output is in some way\ncomputed from the input. They implement both the [Readable][] and\n[Writable][] interfaces.\n\n</p>\n<p>Examples of Transform streams include:\n\n</p>\n<ul>\n<li>[zlib streams][zlib]</li>\n<li>[crypto streams][crypto]</li>\n</ul>\n"
            },
            {
              "textRaw": "Class: stream.Writable",
              "type": "class",
              "name": "stream.Writable",
              "desc": "<p>The Writable stream interface is an abstraction for a <em>destination</em>\nthat you are writing data <em>to</em>.\n\n</p>\n<p>Examples of writable streams include:\n\n</p>\n<ul>\n<li>[HTTP requests, on the client][]</li>\n<li>[HTTP responses, on the server][]</li>\n<li>[fs write streams][]</li>\n<li>[zlib streams][zlib]</li>\n<li>[crypto streams][crypto]</li>\n<li>[TCP sockets][]</li>\n<li>[child process stdin][]</li>\n<li>[<code>process.stdout</code>][], [<code>process.stderr</code>][]</li>\n</ul>\n",
              "events": [
                {
                  "textRaw": "Event: 'drain'",
                  "type": "event",
                  "name": "drain",
                  "desc": "<p>If a [<code>stream.write(chunk)</code>][stream-write] call returns <code>false</code>, then the\n<code>&#39;drain&#39;</code> event will indicate when it is appropriate to begin writing more data\nto the stream.\n\n</p>\n<pre><code class=\"js\">// Write the data to the supplied writable stream one million times.\n// Be attentive to back-pressure.\nfunction writeOneMillionTimes(writer, data, encoding, callback) {\n  var i = 1000000;\n  write();\n  function write() {\n    var ok = true;\n    do {\n      i -= 1;\n      if (i === 0) {\n        // last time!\n        writer.write(data, encoding, callback);\n      } else {\n        // see if we should continue, or wait\n        // don&#39;t pass the callback, because we&#39;re not done yet.\n        ok = writer.write(data, encoding);\n      }\n    } while (i &gt; 0 &amp;&amp; ok);\n    if (i &gt; 0) {\n      // had to stop early!\n      // write some more once it drains\n      writer.once(&#39;drain&#39;, write);\n    }\n  }\n}</code></pre>\n",
                  "params": []
                },
                {
                  "textRaw": "Event: 'error'",
                  "type": "event",
                  "name": "error",
                  "params": [],
                  "desc": "<p>Emitted if there was an error when writing or piping data.\n\n</p>\n"
                },
                {
                  "textRaw": "Event: 'finish'",
                  "type": "event",
                  "name": "finish",
                  "desc": "<p>When the [<code>stream.end()</code>][stream-end] method has been called, and all data has\nbeen flushed to the underlying system, this event is emitted.\n\n</p>\n<pre><code class=\"javascript\">var writer = getWritableStreamSomehow();\nfor (var i = 0; i &lt; 100; i ++) {\n  writer.write(&#39;hello, #${i}!\\n&#39;);\n}\nwriter.end(&#39;this is the end\\n&#39;);\nwriter.on(&#39;finish&#39;, () =&gt; {\n  console.error(&#39;all writes are now complete.&#39;);\n});</code></pre>\n",
                  "params": []
                },
                {
                  "textRaw": "Event: 'pipe'",
                  "type": "event",
                  "name": "pipe",
                  "params": [],
                  "desc": "<p>This is emitted whenever the [<code>stream.pipe()</code>][] method is called on a readable\nstream, adding this writable to its set of destinations.\n\n</p>\n<pre><code class=\"js\">var writer = getWritableStreamSomehow();\nvar reader = getReadableStreamSomehow();\nwriter.on(&#39;pipe&#39;, (src) =&gt; {\n  console.error(&#39;something is piping into the writer&#39;);\n  assert.equal(src, reader);\n});\nreader.pipe(writer);</code></pre>\n"
                },
                {
                  "textRaw": "Event: 'unpipe'",
                  "type": "event",
                  "name": "unpipe",
                  "params": [],
                  "desc": "<p>This is emitted whenever the [<code>stream.unpipe()</code>][] method is called on a\nreadable stream, removing this writable from its set of destinations.\n\n</p>\n<pre><code class=\"js\">var writer = getWritableStreamSomehow();\nvar reader = getReadableStreamSomehow();\nwriter.on(&#39;unpipe&#39;, (src) =&gt; {\n  console.error(&#39;something has stopped piping into the writer&#39;);\n  assert.equal(src, reader);\n});\nreader.pipe(writer);\nreader.unpipe(writer);</code></pre>\n"
                }
              ],
              "methods": [
                {
                  "textRaw": "writable.cork()",
                  "type": "method",
                  "name": "cork",
                  "desc": "<p>Forces buffering of all writes.\n\n</p>\n<p>Buffered data will be flushed either at [<code>stream.uncork()</code>][] or at\n[<code>stream.end()</code>][stream-end] call.\n\n</p>\n",
                  "signatures": [
                    {
                      "params": []
                    }
                  ]
                },
                {
                  "textRaw": "writable.end([chunk][, encoding][, callback])",
                  "type": "method",
                  "name": "end",
                  "signatures": [
                    {
                      "params": [
                        {
                          "textRaw": "`chunk` {String|Buffer} Optional data to write ",
                          "name": "chunk",
                          "type": "String|Buffer",
                          "desc": "Optional data to write",
                          "optional": true
                        },
                        {
                          "textRaw": "`encoding` {String} The encoding, if `chunk` is a String ",
                          "name": "encoding",
                          "type": "String",
                          "desc": "The encoding, if `chunk` is a String",
                          "optional": true
                        },
                        {
                          "textRaw": "`callback` {Function} Optional callback for when the stream is finished ",
                          "name": "callback",
                          "type": "Function",
                          "desc": "Optional callback for when the stream is finished",
                          "optional": true
                        }
                      ]
                    },
                    {
                      "params": [
                        {
                          "name": "chunk",
                          "optional": true
                        },
                        {
                          "name": "encoding",
                          "optional": true
                        },
                        {
                          "name": "callback",
                          "optional": true
                        }
                      ]
                    }
                  ],
                  "desc": "<p>Call this method when no more data will be written to the stream. If supplied,\nthe callback is attached as a listener on the [<code>&#39;finish&#39;</code>][] event.\n\n</p>\n<p>Calling [<code>stream.write()</code>][stream-write] after calling\n[<code>stream.end()</code>][stream-end] will raise an error.\n\n</p>\n<pre><code class=\"js\">// write &#39;hello, &#39; and then end with &#39;world!&#39;\nvar file = fs.createWriteStream(&#39;example.txt&#39;);\nfile.write(&#39;hello, &#39;);\nfile.end(&#39;world!&#39;);\n// writing more now is not allowed!</code></pre>\n"
                },
                {
                  "textRaw": "writable.setDefaultEncoding(encoding)",
                  "type": "method",
                  "name": "setDefaultEncoding",
                  "signatures": [
                    {
                      "params": [
                        {
                          "textRaw": "`encoding` {String} The new default encoding ",
                          "name": "encoding",
                          "type": "String",
                          "desc": "The new default encoding"
                        }
                      ]
                    },
                    {
                      "params": [
                        {
                          "name": "encoding"
                        }
                      ]
                    }
                  ],
                  "desc": "<p>Sets the default encoding for a writable stream.\n\n</p>\n"
                },
                {
                  "textRaw": "writable.uncork()",
                  "type": "method",
                  "name": "uncork",
                  "desc": "<p>Flush all data, buffered since [<code>stream.cork()</code>][] call.\n\n</p>\n",
                  "signatures": [
                    {
                      "params": []
                    }
                  ]
                },
                {
                  "textRaw": "writable.write(chunk[, encoding][, callback])",
                  "type": "method",
                  "name": "write",
                  "signatures": [
                    {
                      "return": {
                        "textRaw": "Returns: {Boolean} `true` if the data was handled completely. ",
                        "name": "return",
                        "type": "Boolean",
                        "desc": "`true` if the data was handled completely."
                      },
                      "params": [
                        {
                          "textRaw": "`chunk` {String|Buffer} The data to write ",
                          "name": "chunk",
                          "type": "String|Buffer",
                          "desc": "The data to write"
                        },
                        {
                          "textRaw": "`encoding` {String} The encoding, if `chunk` is a String ",
                          "name": "encoding",
                          "type": "String",
                          "desc": "The encoding, if `chunk` is a String",
                          "optional": true
                        },
                        {
                          "textRaw": "`callback` {Function} Callback for when this chunk of data is flushed ",
                          "name": "callback",
                          "type": "Function",
                          "desc": "Callback for when this chunk of data is flushed",
                          "optional": true
                        }
                      ]
                    },
                    {
                      "params": [
                        {
                          "name": "chunk"
                        },
                        {
                          "name": "encoding",
                          "optional": true
                        },
                        {
                          "name": "callback",
                          "optional": true
                        }
                      ]
                    }
                  ],
                  "desc": "<p>This method writes some data to the underlying system, and calls the\nsupplied callback once the data has been fully handled.\n\n</p>\n<p>The return value indicates if you should continue writing right now.\nIf the data had to be buffered internally, then it will return\n<code>false</code>. Otherwise, it will return <code>true</code>.\n\n</p>\n<p>This return value is strictly advisory. You MAY continue to write,\neven if it returns <code>false</code>. However, writes will be buffered in\nmemory, so it is best not to do this excessively. Instead, wait for\nthe [<code>&#39;drain&#39;</code>][] event before writing more data.\n\n\n</p>\n"
                }
              ]
            }
          ]
        },
        {
          "textRaw": "API for Stream Implementors",
          "name": "API for Stream Implementors",
          "type": "misc",
          "desc": "<p>To implement any sort of stream, the pattern is the same:\n\n</p>\n<ol>\n<li>Extend the appropriate parent class in your own subclass. (The\n[<code>util.inherits()</code>][] method is particularly helpful for this.)</li>\n<li>Call the appropriate parent class constructor in your constructor,\nto be sure that the internal mechanisms are set up properly.</li>\n<li>Implement one or more specific methods, as detailed below.</li>\n</ol>\n<p>The class to extend and the method(s) to implement depend on the sort\nof stream class you are writing:\n\n</p>\n<table>\n  <thead>\n    <tr>\n      <th>\n        <p>Use-case</p>\n      </th>\n      <th>\n        <p>Class</p>\n      </th>\n      <th>\n        <p>Method(s) to implement</p>\n      </th>\n    </tr>\n  </thead>\n  <tr>\n    <td>\n      <p>Reading only</p>\n    </td>\n    <td>\n      <p><a href=\"#stream_class_stream_readable_1\">Readable</a></p>\n    </td>\n    <td>\n      <p><code>[_read][stream-_read]</code></p>\n    </td>\n  </tr>\n  <tr>\n    <td>\n      <p>Writing only</p>\n    </td>\n    <td>\n      <p><a href=\"#stream_class_stream_writable_1\">Writable</a></p>\n    </td>\n    <td>\n      <p><code>[_write][stream-_write]</code>, <code>[_writev][stream-_writev]</code></p>\n    </td>\n  </tr>\n  <tr>\n    <td>\n      <p>Reading and writing</p>\n    </td>\n    <td>\n      <p><a href=\"#stream_class_stream_duplex_1\">Duplex</a></p>\n    </td>\n    <td>\n      <p><code>[_read][stream-_read]</code>, <code>[_write][stream-_write]</code>, <code>[_writev][stream-_writev]</code></p>\n    </td>\n  </tr>\n  <tr>\n    <td>\n      <p>Operate on written data, then read the result</p>\n    </td>\n    <td>\n      <p><a href=\"#stream_class_stream_transform_1\">Transform</a></p>\n    </td>\n    <td>\n      <p><code>[_transform][stream-_transform]</code>, <code>[_flush][stream-_flush]</code></p>\n    </td>\n  </tr>\n</table>\n\n<p>In your implementation code, it is very important to never call the methods\ndescribed in [API for Stream Consumers][]. Otherwise, you can potentially cause\nadverse side effects in programs that consume your streaming interfaces.\n\n</p>\n",
          "classes": [
            {
              "textRaw": "Class: stream.Duplex",
              "type": "class",
              "name": "stream.Duplex",
              "desc": "<p>A &quot;duplex&quot; stream is one that is both Readable and Writable, such as a TCP\nsocket connection.\n\n</p>\n<p>Note that <code>stream.Duplex</code> is an abstract class designed to be extended\nwith an underlying implementation of the [<code>stream._read(size)</code>][stream-_read]\nand [<code>stream._write(chunk, encoding, callback)</code>][stream-_write] methods as you\nwould with a Readable or Writable stream class.\n\n</p>\n<p>Since JavaScript doesn&#39;t have multiple prototypal inheritance, this class\nprototypally inherits from Readable, and then parasitically from Writable. It is\nthus up to the user to implement both the low-level\n[<code>stream._read(n)</code>][stream-_read] method as well as the low-level\n[<code>stream._write(chunk, encoding, callback)</code>][stream-_write] method on extension\nduplex classes.\n\n</p>\n",
              "methods": [
                {
                  "textRaw": "new stream.Duplex(options)",
                  "type": "method",
                  "name": "Duplex",
                  "signatures": [
                    {
                      "params": [
                        {
                          "textRaw": "`options` {Object} Passed to both Writable and Readable constructors. Also has the following fields: ",
                          "options": [
                            {
                              "textRaw": "`allowHalfOpen` {Boolean} Default = `true`. If set to `false`, then the stream will automatically end the readable side when the writable side ends and vice versa. ",
                              "name": "allowHalfOpen",
                              "type": "Boolean",
                              "desc": "Default = `true`. If set to `false`, then the stream will automatically end the readable side when the writable side ends and vice versa."
                            },
                            {
                              "textRaw": "`readableObjectMode` {Boolean} Default = `false`. Sets `objectMode` for readable side of the stream. Has no effect if `objectMode` is `true`. ",
                              "name": "readableObjectMode",
                              "type": "Boolean",
                              "desc": "Default = `false`. Sets `objectMode` for readable side of the stream. Has no effect if `objectMode` is `true`."
                            },
                            {
                              "textRaw": "`writableObjectMode` {Boolean} Default = `false`. Sets `objectMode` for writable side of the stream. Has no effect if `objectMode` is `true`. ",
                              "name": "writableObjectMode",
                              "type": "Boolean",
                              "desc": "Default = `false`. Sets `objectMode` for writable side of the stream. Has no effect if `objectMode` is `true`."
                            }
                          ],
                          "name": "options",
                          "type": "Object",
                          "desc": "Passed to both Writable and Readable constructors. Also has the following fields:"
                        }
                      ]
                    },
                    {
                      "params": [
                        {
                          "name": "options"
                        }
                      ]
                    }
                  ],
                  "desc": "<p>In classes that extend the Duplex class, make sure to call the\nconstructor so that the buffering settings can be properly\ninitialized.\n\n</p>\n"
                }
              ]
            },
            {
              "textRaw": "Class: stream.PassThrough",
              "type": "class",
              "name": "stream.PassThrough",
              "desc": "<p>This is a trivial implementation of a [Transform][] stream that simply\npasses the input bytes across to the output. Its purpose is mainly\nfor examples and testing, but there are occasionally use cases where\nit can come in handy as a building block for novel sorts of streams.\n\n</p>\n"
            },
            {
              "textRaw": "Class: stream.Readable",
              "type": "class",
              "name": "stream.Readable",
              "desc": "<p><code>stream.Readable</code> is an abstract class designed to be extended with an\nunderlying implementation of the [<code>stream._read(size)</code>][stream-_read] method.\n\n</p>\n<p>Please see [API for Stream Consumers][] for how to consume\nstreams in your programs. What follows is an explanation of how to\nimplement Readable streams in your programs.\n\n</p>\n",
              "methods": [
                {
                  "textRaw": "new stream.Readable([options])",
                  "type": "method",
                  "name": "Readable",
                  "signatures": [
                    {
                      "params": [
                        {
                          "textRaw": "`options` {Object} ",
                          "options": [
                            {
                              "textRaw": "`highWaterMark` {Number} The maximum number of bytes to store in the internal buffer before ceasing to read from the underlying resource. Default = `16384` (16kb), or `16` for `objectMode` streams ",
                              "name": "highWaterMark",
                              "type": "Number",
                              "desc": "The maximum number of bytes to store in the internal buffer before ceasing to read from the underlying resource. Default = `16384` (16kb), or `16` for `objectMode` streams"
                            },
                            {
                              "textRaw": "`encoding` {String} If specified, then buffers will be decoded to strings using the specified encoding. Default = `null` ",
                              "name": "encoding",
                              "type": "String",
                              "desc": "If specified, then buffers will be decoded to strings using the specified encoding. Default = `null`"
                            },
                            {
                              "textRaw": "`objectMode` {Boolean} Whether this stream should behave as a stream of objects. Meaning that [`stream.read(n)`][stream-read] returns a single value instead of a Buffer of size n. Default = `false` ",
                              "name": "objectMode",
                              "type": "Boolean",
                              "desc": "Whether this stream should behave as a stream of objects. Meaning that [`stream.read(n)`][stream-read] returns a single value instead of a Buffer of size n. Default = `false`"
                            },
                            {
                              "textRaw": "`read` {Function} Implementation for the [`stream._read()`][stream-_read] method. ",
                              "name": "read",
                              "type": "Function",
                              "desc": "Implementation for the [`stream._read()`][stream-_read] method."
                            }
                          ],
                          "name": "options",
                          "type": "Object",
                          "optional": true
                        }
                      ]
                    },
                    {
                      "params": [
                        {
                          "name": "options",
                          "optional": true
                        }
                      ]
                    }
                  ],
                  "desc": "<p>In classes that extend the Readable class, make sure to call the\nReadable constructor so that the buffering settings can be properly\ninitialized.\n\n</p>\n"
                },
                {
                  "textRaw": "readable.\\_read(size)",
                  "type": "method",
                  "name": "\\_read",
                  "signatures": [
                    {
                      "params": [
                        {
                          "textRaw": "`size` {Number} Number of bytes to read asynchronously ",
                          "name": "size",
                          "type": "Number",
                          "desc": "Number of bytes to read asynchronously"
                        }
                      ]
                    },
                    {
                      "params": [
                        {
                          "name": "size"
                        }
                      ]
                    }
                  ],
                  "desc": "<p>Note: <strong>Implement this method, but do NOT call it directly.</strong>\n\n</p>\n<p>This method is prefixed with an underscore because it is internal to the\nclass that defines it and should only be called by the internal Readable\nclass methods. All Readable stream implementations must provide a _read\nmethod to fetch data from the underlying resource.\n\n</p>\n<p>When <code>_read()</code> is called, if data is available from the resource, the <code>_read()</code>\nimplementation should start pushing that data into the read queue by calling\n[<code>this.push(dataChunk)</code>][stream-push]. <code>_read()</code> should continue reading from\nthe resource and pushing data until push returns <code>false</code>, at which point it\nshould stop reading from the resource. Only when <code>_read()</code> is called again after\nit has stopped should it start reading more data from the resource and pushing\nthat data onto the queue.\n\n</p>\n<p>Note: once the <code>_read()</code> method is called, it will not be called again until\nthe [<code>stream.push()</code>][stream-push] method is called.\n\n</p>\n<p>The <code>size</code> argument is advisory. Implementations where a &quot;read&quot; is a\nsingle call that returns data can use this to know how much data to\nfetch. Implementations where that is not relevant, such as TCP or\nTLS, may ignore this argument, and simply provide data whenever it\nbecomes available. There is no need, for example to &quot;wait&quot; until\n<code>size</code> bytes are available before calling [<code>stream.push(chunk)</code>][stream-push].\n\n</p>\n"
                }
              ],
              "examples": [
                {
                  "textRaw": "readable.push(chunk[, encoding])",
                  "type": "example",
                  "name": "push",
                  "signatures": [
                    {
                      "return": {
                        "textRaw": "return {Boolean} Whether or not more pushes should be performed ",
                        "name": "return",
                        "type": "Boolean",
                        "desc": "Whether or not more pushes should be performed"
                      },
                      "params": [
                        {
                          "textRaw": "`chunk` {Buffer|Null|String} Chunk of data to push into the read queue ",
                          "name": "chunk",
                          "type": "Buffer|Null|String",
                          "desc": "Chunk of data to push into the read queue"
                        },
                        {
                          "textRaw": "`encoding` {String} Encoding of String chunks.  Must be a valid Buffer encoding, such as `'utf8'` or `'ascii'` ",
                          "name": "encoding",
                          "type": "String",
                          "desc": "Encoding of String chunks.  Must be a valid Buffer encoding, such as `'utf8'` or `'ascii'`",
                          "optional": true
                        }
                      ]
                    }
                  ],
                  "desc": "<p>Note: <strong>This method should be called by Readable implementors, NOT\nby consumers of Readable streams.</strong>\n\n</p>\n<p>If a value other than null is passed, The <code>push()</code> method adds a chunk of data\ninto the queue for subsequent stream processors to consume. If <code>null</code> is\npassed, it signals the end of the stream (EOF), after which no more data\ncan be written.\n\n</p>\n<p>The data added with <code>push()</code> can be pulled out by calling the\n[<code>stream.read()</code>][stream-read] method when the [<code>&#39;readable&#39;</code>][] event fires.\n\n</p>\n<p>This API is designed to be as flexible as possible. For example,\nyou may be wrapping a lower-level source which has some sort of\npause/resume mechanism, and a data callback. In those cases, you\ncould wrap the low-level source object by doing something like this:\n\n</p>\n<pre><code class=\"js\">// source is an object with readStop() and readStart() methods,\n// and an `ondata` member that gets called when it has data, and\n// an `onend` member that gets called when the data is over.\n\nutil.inherits(SourceWrapper, Readable);\n\nfunction SourceWrapper(options) {\n  Readable.call(this, options);\n\n  this._source = getLowlevelSourceObject();\n\n  // Every time there&#39;s data, we push it into the internal buffer.\n  this._source.ondata = (chunk) =&gt; {\n    // if push() returns false, then we need to stop reading from source\n    if (!this.push(chunk))\n      this._source.readStop();\n  };\n\n  // When the source ends, we push the EOF-signaling `null` chunk\n  this._source.onend = () =&gt; {\n    this.push(null);\n  };\n}\n\n// _read will be called when the stream wants to pull more data in\n// the advisory size argument is ignored in this case.\nSourceWrapper.prototype._read = function(size) {\n  this._source.readStart();\n};</code></pre>\n<h4>Example: A Counting Stream</h4>\n<p>This is a basic example of a Readable stream. It emits the numerals\nfrom 1 to 1,000,000 in ascending order, and then ends.\n\n</p>\n<pre><code class=\"js\">const Readable = require(&#39;stream&#39;).Readable;\nconst util = require(&#39;util&#39;);\nutil.inherits(Counter, Readable);\n\nfunction Counter(opt) {\n  Readable.call(this, opt);\n  this._max = 1000000;\n  this._index = 1;\n}\n\nCounter.prototype._read = function() {\n  var i = this._index++;\n  if (i &gt; this._max)\n    this.push(null);\n  else {\n    var str = &#39;&#39; + i;\n    var buf = new Buffer(str, &#39;ascii&#39;);\n    this.push(buf);\n  }\n};</code></pre>\n<h4>Example: SimpleProtocol v1 (Sub-optimal)</h4>\n<p>This is similar to the <code>parseHeader</code> function described\n<a href=\"#stream_readable_unshift_chunk\">here</a>, but implemented as a custom stream.\nAlso, note that this implementation does not convert the incoming data to a\nstring.\n\n</p>\n<p>However, this would be better implemented as a [Transform][] stream. See\n[SimpleProtocol v2][] for a better implementation.\n\n</p>\n<pre><code class=\"js\">// A parser for a simple data protocol.\n// The &quot;header&quot; is a JSON object, followed by 2 \\n characters, and\n// then a message body.\n//\n// NOTE: This can be done more simply as a Transform stream!\n// Using Readable directly for this is sub-optimal. See the\n// alternative example below under the Transform section.\n\nconst Readable = require(&#39;stream&#39;).Readable;\nconst util = require(&#39;util&#39;);\n\nutil.inherits(SimpleProtocol, Readable);\n\nfunction SimpleProtocol(source, options) {\n  if (!(this instanceof SimpleProtocol))\n    return new SimpleProtocol(source, options);\n\n  Readable.call(this, options);\n  this._inBody = false;\n  this._sawFirstCr = false;\n\n  // source is a readable stream, such as a socket or file\n  this._source = source;\n\n  var self = this;\n  source.on(&#39;end&#39;, () =&gt; {\n    self.push(null);\n  });\n\n  // give it a kick whenever the source is readable\n  // read(0) will not consume any bytes\n  source.on(&#39;readable&#39;, () =&gt; {\n    self.read(0);\n  });\n\n  this._rawHeader = [];\n  this.header = null;\n}\n\nSimpleProtocol.prototype._read = function(n) {\n  if (!this._inBody) {\n    var chunk = this._source.read();\n\n    // if the source doesn&#39;t have data, we don&#39;t have data yet.\n    if (chunk === null)\n      return this.push(&#39;&#39;);\n\n    // check if the chunk has a \\n\\n\n    var split = -1;\n    for (var i = 0; i &lt; chunk.length; i++) {\n      if (chunk[i] === 10) { // &#39;\\n&#39;\n        if (this._sawFirstCr) {\n          split = i;\n          break;\n        } else {\n          this._sawFirstCr = true;\n        }\n      } else {\n        this._sawFirstCr = false;\n      }\n    }\n\n    if (split === -1) {\n      // still waiting for the \\n\\n\n      // stash the chunk, and try again.\n      this._rawHeader.push(chunk);\n      this.push(&#39;&#39;);\n    } else {\n      this._inBody = true;\n      var h = chunk.slice(0, split);\n      this._rawHeader.push(h);\n      var header = Buffer.concat(this._rawHeader).toString();\n      try {\n        this.header = JSON.parse(header);\n      } catch (er) {\n        this.emit(&#39;error&#39;, new Error(&#39;invalid simple protocol data&#39;));\n        return;\n      }\n      // now, because we got some extra data, unshift the rest\n      // back into the read queue so that our consumer will see it.\n      var b = chunk.slice(split);\n      this.unshift(b);\n      // calling unshift by itself does not reset the reading state\n      // of the stream; since we&#39;re inside _read, doing an additional\n      // push(&#39;&#39;) will reset the state appropriately.\n      this.push(&#39;&#39;);\n\n      // and let them know that we are done parsing the header.\n      this.emit(&#39;header&#39;, this.header);\n    }\n  } else {\n    // from there on, just provide the data to our consumer.\n    // careful not to push(null), since that would indicate EOF.\n    var chunk = this._source.read();\n    if (chunk) this.push(chunk);\n  }\n};\n\n// Usage:\n// var parser = new SimpleProtocol(source);\n// Now parser is a readable stream that will emit &#39;header&#39;\n// with the parsed header data.</code></pre>\n"
                }
              ]
            },
            {
              "textRaw": "Class: stream.Transform",
              "type": "class",
              "name": "stream.Transform",
              "desc": "<p>A &quot;transform&quot; stream is a duplex stream where the output is causally\nconnected in some way to the input, such as a [zlib][] stream or a\n[crypto][] stream.\n\n</p>\n<p>There is no requirement that the output be the same size as the input,\nthe same number of chunks, or arrive at the same time. For example, a\nHash stream will only ever have a single chunk of output which is\nprovided when the input is ended. A zlib stream will produce output\nthat is either much smaller or much larger than its input.\n\n</p>\n<p>Rather than implement the [<code>stream._read()</code>][stream-_read] and\n[<code>stream._write()</code>][stream-_write] methods, Transform classes must implement the\n[<code>stream._transform()</code>][stream-_transform] method, and may optionally\nalso implement the [<code>stream._flush()</code>][stream-_flush] method. (See below.)\n\n</p>\n",
              "methods": [
                {
                  "textRaw": "new stream.Transform([options])",
                  "type": "method",
                  "name": "Transform",
                  "signatures": [
                    {
                      "params": [
                        {
                          "textRaw": "`options` {Object} Passed to both Writable and Readable constructors. Also has the following fields: ",
                          "options": [
                            {
                              "textRaw": "`transform` {Function} Implementation for the [`stream._transform()`][stream-_transform] method. ",
                              "name": "transform",
                              "type": "Function",
                              "desc": "Implementation for the [`stream._transform()`][stream-_transform] method."
                            },
                            {
                              "textRaw": "`flush` {Function} Implementation for the [`stream._flush()`][stream-_flush] method. ",
                              "name": "flush",
                              "type": "Function",
                              "desc": "Implementation for the [`stream._flush()`][stream-_flush] method."
                            }
                          ],
                          "name": "options",
                          "type": "Object",
                          "desc": "Passed to both Writable and Readable constructors. Also has the following fields:",
                          "optional": true
                        }
                      ]
                    },
                    {
                      "params": [
                        {
                          "name": "options",
                          "optional": true
                        }
                      ]
                    }
                  ],
                  "desc": "<p>In classes that extend the Transform class, make sure to call the\nconstructor so that the buffering settings can be properly\ninitialized.\n\n</p>\n"
                },
                {
                  "textRaw": "transform.\\_flush(callback)",
                  "type": "method",
                  "name": "\\_flush",
                  "signatures": [
                    {
                      "params": [
                        {
                          "textRaw": "`callback` {Function} Call this function (optionally with an error argument) when you are done flushing any remaining data. ",
                          "name": "callback",
                          "type": "Function",
                          "desc": "Call this function (optionally with an error argument) when you are done flushing any remaining data."
                        }
                      ]
                    },
                    {
                      "params": [
                        {
                          "name": "callback"
                        }
                      ]
                    }
                  ],
                  "desc": "<p>Note: <strong>This function MUST NOT be called directly.</strong>  It MAY be implemented\nby child classes, and if so, will be called by the internal Transform\nclass methods only.\n\n</p>\n<p>In some cases, your transform operation may need to emit a bit more\ndata at the end of the stream. For example, a <code>Zlib</code> compression\nstream will store up some internal state so that it can optimally\ncompress the output. At the end, however, it needs to do the best it\ncan with what is left, so that the data will be complete.\n\n</p>\n<p>In those cases, you can implement a <code>_flush()</code> method, which will be\ncalled at the very end, after all the written data is consumed, but\nbefore emitting [<code>&#39;end&#39;</code>][] to signal the end of the readable side. Just\nlike with [<code>stream._transform()</code>][stream-_transform], call\n<code>transform.push(chunk)</code> zero or more times, as appropriate, and call <code>callback</code>\nwhen the flush operation is complete.\n\n</p>\n<p>This method is prefixed with an underscore because it is internal to\nthe class that defines it, and should not be called directly by user\nprograms. However, you <strong>are</strong> expected to override this method in\nyour own extension classes.\n\n</p>\n"
                },
                {
                  "textRaw": "transform.\\_transform(chunk, encoding, callback)",
                  "type": "method",
                  "name": "\\_transform",
                  "signatures": [
                    {
                      "params": [
                        {
                          "textRaw": "`chunk` {Buffer|String} The chunk to be transformed. Will **always** be a buffer unless the `decodeStrings` option was set to `false`. ",
                          "name": "chunk",
                          "type": "Buffer|String",
                          "desc": "The chunk to be transformed. Will **always** be a buffer unless the `decodeStrings` option was set to `false`."
                        },
                        {
                          "textRaw": "`encoding` {String} If the chunk is a string, then this is the encoding type. If chunk is a buffer, then this is the special value - 'buffer', ignore it in this case. ",
                          "name": "encoding",
                          "type": "String",
                          "desc": "If the chunk is a string, then this is the encoding type. If chunk is a buffer, then this is the special value - 'buffer', ignore it in this case."
                        },
                        {
                          "textRaw": "`callback` {Function} Call this function (optionally with an error argument and data) when you are done processing the supplied chunk. ",
                          "name": "callback",
                          "type": "Function",
                          "desc": "Call this function (optionally with an error argument and data) when you are done processing the supplied chunk."
                        }
                      ]
                    },
                    {
                      "params": [
                        {
                          "name": "chunk"
                        },
                        {
                          "name": "encoding"
                        },
                        {
                          "name": "callback"
                        }
                      ]
                    }
                  ],
                  "desc": "<p>Note: <strong>This function MUST NOT be called directly.</strong>  It should be\nimplemented by child classes, and called by the internal Transform\nclass methods only.\n\n</p>\n<p>All Transform stream implementations must provide a <code>_transform()</code>\nmethod to accept input and produce output.\n\n</p>\n<p><code>_transform()</code> should do whatever has to be done in this specific\nTransform class, to handle the bytes being written, and pass them off\nto the readable portion of the interface. Do asynchronous I/O,\nprocess things, and so on.\n\n</p>\n<p>Call <code>transform.push(outputChunk)</code> 0 or more times to generate output\nfrom this input chunk, depending on how much data you want to output\nas a result of this chunk.\n\n</p>\n<p>Call the callback function only when the current chunk is completely\nconsumed. Note that there may or may not be output as a result of any\nparticular input chunk. If you supply a second argument to the callback\nit will be passed to the push method. In other words the following are\nequivalent:\n\n</p>\n<pre><code class=\"js\">transform.prototype._transform = function (data, encoding, callback) {\n  this.push(data);\n  callback();\n};\n\ntransform.prototype._transform = function (data, encoding, callback) {\n  callback(null, data);\n};</code></pre>\n<p>This method is prefixed with an underscore because it is internal to\nthe class that defines it, and should not be called directly by user\nprograms. However, you <strong>are</strong> expected to override this method in\nyour own extension classes.\n\n</p>\n<h4>Example: <code>SimpleProtocol</code> parser v2</h4>\n<p>The example <a href=\"#stream_example_simpleprotocol_v1_sub_optimal\">here</a> of a simple\nprotocol parser can be implemented simply by using the higher level\n[Transform][] stream class, similar to the <code>parseHeader</code> and <code>SimpleProtocol\nv1</code> examples.\n\n</p>\n<p>In this example, rather than providing the input as an argument, it\nwould be piped into the parser, which is a more idiomatic Node.js stream\napproach.\n\n</p>\n<pre><code class=\"javascript\">const util = require(&#39;util&#39;);\nconst Transform = require(&#39;stream&#39;).Transform;\nutil.inherits(SimpleProtocol, Transform);\n\nfunction SimpleProtocol(options) {\n  if (!(this instanceof SimpleProtocol))\n    return new SimpleProtocol(options);\n\n  Transform.call(this, options);\n  this._inBody = false;\n  this._sawFirstCr = false;\n  this._rawHeader = [];\n  this.header = null;\n}\n\nSimpleProtocol.prototype._transform = function(chunk, encoding, done) {\n  if (!this._inBody) {\n    // check if the chunk has a \\n\\n\n    var split = -1;\n    for (var i = 0; i &lt; chunk.length; i++) {\n      if (chunk[i] === 10) { // &#39;\\n&#39;\n        if (this._sawFirstCr) {\n          split = i;\n          break;\n        } else {\n          this._sawFirstCr = true;\n        }\n      } else {\n        this._sawFirstCr = false;\n      }\n    }\n\n    if (split === -1) {\n      // still waiting for the \\n\\n\n      // stash the chunk, and try again.\n      this._rawHeader.push(chunk);\n    } else {\n      this._inBody = true;\n      var h = chunk.slice(0, split);\n      this._rawHeader.push(h);\n      var header = Buffer.concat(this._rawHeader).toString();\n      try {\n        this.header = JSON.parse(header);\n      } catch (er) {\n        this.emit(&#39;error&#39;, new Error(&#39;invalid simple protocol data&#39;));\n        return;\n      }\n      // and let them know that we are done parsing the header.\n      this.emit(&#39;header&#39;, this.header);\n\n      // now, because we got some extra data, emit this first.\n      this.push(chunk.slice(split));\n    }\n  } else {\n    // from there on, just provide the data to our consumer as-is.\n    this.push(chunk);\n  }\n  done();\n};\n\n// Usage:\n// var parser = new SimpleProtocol();\n// source.pipe(parser)\n// Now parser is a readable stream that will emit &#39;header&#39;\n// with the parsed header data.</code></pre>\n"
                }
              ],
              "modules": [
                {
                  "textRaw": "Events: 'finish' and 'end'",
                  "name": "events:_'finish'_and_'end'",
                  "desc": "<p>The [<code>&#39;finish&#39;</code>][] and [<code>&#39;end&#39;</code>][] events are from the parent Writable\nand Readable classes respectively. The <code>&#39;finish&#39;</code> event is fired after\n[<code>stream.end()</code>][stream-end] is called and all chunks have been processed by\n[<code>stream._transform()</code>][stream-_transform], <code>&#39;end&#39;</code> is fired after all data has\nbeen output which is after the callback in [<code>stream._flush()</code>][stream-_flush]\nhas been called.\n\n</p>\n",
                  "type": "module",
                  "displayName": "Events: 'finish' and 'end'"
                }
              ]
            },
            {
              "textRaw": "Class: stream.Writable",
              "type": "class",
              "name": "stream.Writable",
              "desc": "<p><code>stream.Writable</code> is an abstract class designed to be extended with an\nunderlying implementation of the\n[<code>stream._write(chunk, encoding, callback)</code>][stream-_write] method.\n\n</p>\n<p>Please see [API for Stream Consumers][] for how to consume\nwritable streams in your programs. What follows is an explanation of\nhow to implement Writable streams in your programs.\n\n</p>\n",
              "methods": [
                {
                  "textRaw": "new stream.Writable([options])",
                  "type": "method",
                  "name": "Writable",
                  "signatures": [
                    {
                      "params": [
                        {
                          "textRaw": "`options` {Object} ",
                          "options": [
                            {
                              "textRaw": "`highWaterMark` {Number} Buffer level when [`stream.write()`][stream-write] starts returning `false`. Default = `16384` (16kb), or `16` for `objectMode` streams. ",
                              "name": "highWaterMark",
                              "type": "Number",
                              "desc": "Buffer level when [`stream.write()`][stream-write] starts returning `false`. Default = `16384` (16kb), or `16` for `objectMode` streams."
                            },
                            {
                              "textRaw": "`decodeStrings` {Boolean} Whether or not to decode strings into Buffers before passing them to [`stream._write()`][stream-_write]. Default = `true` ",
                              "name": "decodeStrings",
                              "type": "Boolean",
                              "desc": "Whether or not to decode strings into Buffers before passing them to [`stream._write()`][stream-_write]. Default = `true`"
                            },
                            {
                              "textRaw": "`objectMode` {Boolean} Whether or not the [`stream.write(anyObj)`][stream-write] is a valid operation. If set you can write arbitrary data instead of only `Buffer` / `String` data. Default = `false` ",
                              "name": "objectMode",
                              "type": "Boolean",
                              "desc": "Whether or not the [`stream.write(anyObj)`][stream-write] is a valid operation. If set you can write arbitrary data instead of only `Buffer` / `String` data. Default = `false`"
                            },
                            {
                              "textRaw": "`write` {Function} Implementation for the [`stream._write()`][stream-_write] method. ",
                              "name": "write",
                              "type": "Function",
                              "desc": "Implementation for the [`stream._write()`][stream-_write] method."
                            },
                            {
                              "textRaw": "`writev` {Function} Implementation for the [`stream._writev()`][stream-_writev] method. ",
                              "name": "writev",
                              "type": "Function",
                              "desc": "Implementation for the [`stream._writev()`][stream-_writev] method."
                            }
                          ],
                          "name": "options",
                          "type": "Object",
                          "optional": true
                        }
                      ]
                    },
                    {
                      "params": [
                        {
                          "name": "options",
                          "optional": true
                        }
                      ]
                    }
                  ],
                  "desc": "<p>In classes that extend the Writable class, make sure to call the\nconstructor so that the buffering settings can be properly\ninitialized.\n\n</p>\n"
                },
                {
                  "textRaw": "writable.\\_write(chunk, encoding, callback)",
                  "type": "method",
                  "name": "\\_write",
                  "signatures": [
                    {
                      "params": [
                        {
                          "textRaw": "`chunk` {Buffer|String} The chunk to be written. Will **always** be a buffer unless the `decodeStrings` option was set to `false`. ",
                          "name": "chunk",
                          "type": "Buffer|String",
                          "desc": "The chunk to be written. Will **always** be a buffer unless the `decodeStrings` option was set to `false`."
                        },
                        {
                          "textRaw": "`encoding` {String} If the chunk is a string, then this is the encoding type. If chunk is a buffer, then this is the special value - 'buffer', ignore it in this case. ",
                          "name": "encoding",
                          "type": "String",
                          "desc": "If the chunk is a string, then this is the encoding type. If chunk is a buffer, then this is the special value - 'buffer', ignore it in this case."
                        },
                        {
                          "textRaw": "`callback` {Function} Call this function (optionally with an error argument) when you are done processing the supplied chunk. ",
                          "name": "callback",
                          "type": "Function",
                          "desc": "Call this function (optionally with an error argument) when you are done processing the supplied chunk."
                        }
                      ]
                    },
                    {
                      "params": [
                        {
                          "name": "chunk"
                        },
                        {
                          "name": "encoding"
                        },
                        {
                          "name": "callback"
                        }
                      ]
                    }
                  ],
                  "desc": "<p>All Writable stream implementations must provide a\n[<code>stream._write()</code>][stream-_write] method to send data to the underlying\nresource.\n\n</p>\n<p>Note: <strong>This function MUST NOT be called directly.</strong>  It should be\nimplemented by child classes, and called by the internal Writable\nclass methods only.\n\n</p>\n<p>Call the callback using the standard <code>callback(error)</code> pattern to\nsignal that the write completed successfully or with an error.\n\n</p>\n<p>If the <code>decodeStrings</code> flag is set in the constructor options, then\n<code>chunk</code> may be a string rather than a Buffer, and <code>encoding</code> will\nindicate the sort of string that it is. This is to support\nimplementations that have an optimized handling for certain string\ndata encodings. If you do not explicitly set the <code>decodeStrings</code>\noption to <code>false</code>, then you can safely ignore the <code>encoding</code> argument,\nand assume that <code>chunk</code> will always be a Buffer.\n\n</p>\n<p>This method is prefixed with an underscore because it is internal to\nthe class that defines it, and should not be called directly by user\nprograms. However, you <strong>are</strong> expected to override this method in\nyour own extension classes.\n\n</p>\n"
                },
                {
                  "textRaw": "writable.\\_writev(chunks, callback)",
                  "type": "method",
                  "name": "\\_writev",
                  "signatures": [
                    {
                      "params": [
                        {
                          "textRaw": "`chunks` {Array} The chunks to be written. Each chunk has following format: `{ chunk: ..., encoding: ... }`. ",
                          "name": "chunks",
                          "type": "Array",
                          "desc": "The chunks to be written. Each chunk has following format: `{ chunk: ..., encoding: ... }`."
                        },
                        {
                          "textRaw": "`callback` {Function} Call this function (optionally with an error argument) when you are done processing the supplied chunks. ",
                          "name": "callback",
                          "type": "Function",
                          "desc": "Call this function (optionally with an error argument) when you are done processing the supplied chunks."
                        }
                      ]
                    },
                    {
                      "params": [
                        {
                          "name": "chunks"
                        },
                        {
                          "name": "callback"
                        }
                      ]
                    }
                  ],
                  "desc": "<p>Note: <strong>This function MUST NOT be called directly.</strong>  It may be\nimplemented by child classes, and called by the internal Writable\nclass methods only.\n\n</p>\n<p>This function is completely optional to implement. In most cases it is\nunnecessary. If implemented, it will be called with all the chunks\nthat are buffered in the write queue.\n\n\n</p>\n"
                }
              ]
            }
          ]
        },
        {
          "textRaw": "Simplified Constructor API",
          "name": "Simplified Constructor API",
          "type": "misc",
          "desc": "<p>In simple cases there is now the added benefit of being able to construct a\nstream without inheritance.\n\n</p>\n<p>This can be done by passing the appropriate methods as constructor options:\n\n</p>\n<p>Examples:\n\n</p>\n",
          "miscs": [
            {
              "textRaw": "Duplex",
              "name": "duplex",
              "desc": "<pre><code class=\"js\">var duplex = new stream.Duplex({\n  read: function(n) {\n    // sets this._read under the hood\n\n    // push data onto the read queue, passing null\n    // will signal the end of the stream (EOF)\n    this.push(chunk);\n  },\n  write: function(chunk, encoding, next) {\n    // sets this._write under the hood\n\n    // An optional error can be passed as the first argument\n    next()\n  }\n});\n\n// or\n\nvar duplex = new stream.Duplex({\n  read: function(n) {\n    // sets this._read under the hood\n\n    // push data onto the read queue, passing null\n    // will signal the end of the stream (EOF)\n    this.push(chunk);\n  },\n  writev: function(chunks, next) {\n    // sets this._writev under the hood\n\n    // An optional error can be passed as the first argument\n    next()\n  }\n});</code></pre>\n",
              "type": "misc",
              "displayName": "Duplex"
            },
            {
              "textRaw": "Readable",
              "name": "readable",
              "desc": "<pre><code class=\"js\">var readable = new stream.Readable({\n  read: function(n) {\n    // sets this._read under the hood\n\n    // push data onto the read queue, passing null\n    // will signal the end of the stream (EOF)\n    this.push(chunk);\n  }\n});</code></pre>\n",
              "type": "misc",
              "displayName": "Readable"
            },
            {
              "textRaw": "Transform",
              "name": "transform",
              "desc": "<pre><code class=\"js\">var transform = new stream.Transform({\n  transform: function(chunk, encoding, next) {\n    // sets this._transform under the hood\n\n    // generate output as many times as needed\n    // this.push(chunk);\n\n    // call when the current chunk is consumed\n    next();\n  },\n  flush: function(done) {\n    // sets this._flush under the hood\n\n    // generate output as many times as needed\n    // this.push(chunk);\n\n    done();\n  }\n});</code></pre>\n",
              "type": "misc",
              "displayName": "Transform"
            },
            {
              "textRaw": "Writable",
              "name": "writable",
              "desc": "<pre><code class=\"js\">var writable = new stream.Writable({\n  write: function(chunk, encoding, next) {\n    // sets this._write under the hood\n\n    // An optional error can be passed as the first argument\n    next()\n  }\n});\n\n// or\n\nvar writable = new stream.Writable({\n  writev: function(chunks, next) {\n    // sets this._writev under the hood\n\n    // An optional error can be passed as the first argument\n    next()\n  }\n});</code></pre>\n",
              "type": "misc",
              "displayName": "Writable"
            }
          ]
        },
        {
          "textRaw": "Streams: Under the Hood",
          "name": "Streams: Under the Hood",
          "type": "misc",
          "miscs": [
            {
              "textRaw": "Buffering",
              "name": "Buffering",
              "type": "misc",
              "desc": "<p>Both Writable and Readable streams will buffer data on an internal\nobject which can be retrieved from <code>_writableState.getBuffer()</code> or\n<code>_readableState.buffer</code>, respectively.\n\n</p>\n<p>The amount of data that will potentially be buffered depends on the\n<code>highWaterMark</code> option which is passed into the constructor.\n\n</p>\n<p>Buffering in Readable streams happens when the implementation calls\n[<code>stream.push(chunk)</code>][stream-push]. If the consumer of the Stream does not\ncall [<code>stream.read()</code>][stream-read], then the data will sit in the internal\nqueue until it is consumed.\n\n</p>\n<p>Buffering in Writable streams happens when the user calls\n[<code>stream.write(chunk)</code>][stream-write] repeatedly, even when it returns <code>false</code>.\n\n</p>\n<p>The purpose of streams, especially with the [<code>stream.pipe()</code>][] method, is to\nlimit the buffering of data to acceptable levels, so that sources and\ndestinations of varying speed will not overwhelm the available memory.\n\n</p>\n"
            },
            {
              "textRaw": "Compatibility with Older Node.js Versions",
              "name": "Compatibility with Older Node.js Versions",
              "type": "misc",
              "desc": "<p>In versions of Node.js prior to v0.10, the Readable stream interface was\nsimpler, but also less powerful and less useful.\n\n</p>\n<ul>\n<li>Rather than waiting for you to call the [<code>stream.read()</code>][stream-read] method,\n[<code>&#39;data&#39;</code>][] events would start emitting immediately. If you needed to do\nsome I/O to decide how to handle data, then you had to store the chunks\nin some kind of buffer so that they would not be lost.</li>\n<li>The [<code>stream.pause()</code>][stream-pause] method was advisory, rather than\nguaranteed. This meant that you still had to be prepared to receive\n[<code>&#39;data&#39;</code>][] events even when the stream was in a paused state.</li>\n</ul>\n<p>In Node.js v0.10, the [Readable][] class was added.\nFor backwards compatibility with older Node.js programs, Readable streams\nswitch into &quot;flowing mode&quot; when a [<code>&#39;data&#39;</code>][] event handler is added, or\nwhen the [<code>stream.resume()</code>][stream-resume] method is called. The effect is\nthat, even if you are not using the new [<code>stream.read()</code>][stream-read] method\nand [<code>&#39;readable&#39;</code>][] event, you no longer have to worry about losing\n[<code>&#39;data&#39;</code>][] chunks.\n\n</p>\n<p>Most programs will continue to function normally. However, this\nintroduces an edge case in the following conditions:\n\n</p>\n<ul>\n<li>No [<code>&#39;data&#39;</code>][] event handler is added.</li>\n<li>The [<code>stream.resume()</code>][stream-resume] method is never called.</li>\n<li>The stream is not piped to any writable destination.</li>\n</ul>\n<p>For example, consider the following code:\n\n</p>\n<pre><code class=\"js\">// WARNING!  BROKEN!\nnet.createServer((socket) =&gt; {\n\n  // we add an &#39;end&#39; method, but never consume the data\n  socket.on(&#39;end&#39;, () =&gt; {\n    // It will never get here.\n    socket.end(&#39;I got your message (but didnt read it)\\n&#39;);\n  });\n\n}).listen(1337);</code></pre>\n<p>In versions of Node.js prior to v0.10, the incoming message data would be\nsimply discarded. However, in Node.js v0.10 and beyond,\nthe socket will remain paused forever.\n\n</p>\n<p>The workaround in this situation is to call the\n[<code>stream.resume()</code>][stream-resume] method to start the flow of data:\n\n</p>\n<pre><code class=\"js\">// Workaround\nnet.createServer((socket) =&gt; {\n\n  socket.on(&#39;end&#39;, () =&gt; {\n    socket.end(&#39;I got your message (but didnt read it)\\n&#39;);\n  });\n\n  // start the flow of data, discarding it.\n  socket.resume();\n\n}).listen(1337);</code></pre>\n<p>In addition to new Readable streams switching into flowing mode,\npre-v0.10 style streams can be wrapped in a Readable class using the\n[<code>stream.wrap()</code>][] method.\n\n\n</p>\n"
            },
            {
              "textRaw": "Object Mode",
              "name": "Object Mode",
              "type": "misc",
              "desc": "<p>Normally, Streams operate on Strings and Buffers exclusively.\n\n</p>\n<p>Streams that are in <strong>object mode</strong> can emit generic JavaScript values\nother than Buffers and Strings.\n\n</p>\n<p>A Readable stream in object mode will always return a single item from\na call to [<code>stream.read(size)</code>][stream-read], regardless of what the size\nargument is.\n\n</p>\n<p>A Writable stream in object mode will always ignore the <code>encoding</code>\nargument to [<code>stream.write(data, encoding)</code>][stream-write].\n\n</p>\n<p>The special value <code>null</code> still retains its special value for object\nmode streams. That is, for object mode readable streams, <code>null</code> as a\nreturn value from [<code>stream.read()</code>][stream-read] indicates that there is no more\ndata, and [<code>stream.push(null)</code>][stream-push] will signal the end of stream data\n(<code>EOF</code>).\n\n</p>\n<p>No streams in Node.js core are object mode streams. This pattern is only\nused by userland streaming libraries.\n\n</p>\n<p>You should set <code>objectMode</code> in your stream child class constructor on\nthe options object. Setting <code>objectMode</code> mid-stream is not safe.\n\n</p>\n<p>For Duplex streams <code>objectMode</code> can be set exclusively for readable or\nwritable side with <code>readableObjectMode</code> and <code>writableObjectMode</code>\nrespectively. These options can be used to implement parsers and\nserializers with Transform streams.\n\n</p>\n<pre><code class=\"js\">const util = require(&#39;util&#39;);\nconst StringDecoder = require(&#39;string_decoder&#39;).StringDecoder;\nconst Transform = require(&#39;stream&#39;).Transform;\nutil.inherits(JSONParseStream, Transform);\n\n// Gets \\n-delimited JSON string data, and emits the parsed objects\nfunction JSONParseStream() {\n  if (!(this instanceof JSONParseStream))\n    return new JSONParseStream();\n\n  Transform.call(this, { readableObjectMode : true });\n\n  this._buffer = &#39;&#39;;\n  this._decoder = new StringDecoder(&#39;utf8&#39;);\n}\n\nJSONParseStream.prototype._transform = function(chunk, encoding, cb) {\n  this._buffer += this._decoder.write(chunk);\n  // split on newlines\n  var lines = this._buffer.split(/\\r?\\n/);\n  // keep the last partial line buffered\n  this._buffer = lines.pop();\n  for (var l = 0; l &lt; lines.length; l++) {\n    var line = lines[l];\n    try {\n      var obj = JSON.parse(line);\n    } catch (er) {\n      this.emit(&#39;error&#39;, er);\n      return;\n    }\n    // push the parsed object out to the readable consumer\n    this.push(obj);\n  }\n  cb();\n};\n\nJSONParseStream.prototype._flush = function(cb) {\n  // Just handle any leftover\n  var rem = this._buffer.trim();\n  if (rem) {\n    try {\n      var obj = JSON.parse(rem);\n    } catch (er) {\n      this.emit(&#39;error&#39;, er);\n      return;\n    }\n    // push the parsed object out to the readable consumer\n    this.push(obj);\n  }\n  cb();\n};</code></pre>\n"
            },
            {
              "textRaw": "`stream.read(0)`",
              "name": "`stream.read(0)`",
              "desc": "<p>There are some cases where you want to trigger a refresh of the\nunderlying readable stream mechanisms, without actually consuming any\ndata. In that case, you can call <code>stream.read(0)</code>, which will always\nreturn null.\n\n</p>\n<p>If the internal read buffer is below the <code>highWaterMark</code>, and the\nstream is not currently reading, then calling <code>stream.read(0)</code> will trigger\na low-level [<code>stream._read()</code>][stream-_read] call.\n\n</p>\n<p>There is almost never a need to do this. However, you will see some\ncases in Node.js&#39;s internals where this is done, particularly in the\nReadable stream class internals.\n\n</p>\n",
              "type": "misc",
              "displayName": "`stream.read(0)`"
            },
            {
              "textRaw": "`stream.push('')`",
              "name": "`stream.push('')`",
              "desc": "<p>Pushing a zero-byte string or Buffer (when not in [Object mode][]) has an\ninteresting side effect. Because it <em>is</em> a call to\n[<code>stream.push()</code>][stream-push], it will end the <code>reading</code> process. However, it\ndoes <em>not</em> add any data to the readable buffer, so there&#39;s nothing for\na user to consume.\n\n</p>\n<p>Very rarely, there are cases where you have no data to provide now,\nbut the consumer of your stream (or, perhaps, another bit of your own\ncode) will know when to check again, by calling [<code>stream.read(0)</code>][stream-read].\nIn those cases, you <em>may</em> call <code>stream.push(&#39;&#39;)</code>.\n\n</p>\n<p>So far, the only use case for this functionality is in the\n[<code>tls.CryptoStream</code>][] class, which is deprecated in Node.js/io.js v1.0. If you\nfind that you have to use <code>stream.push(&#39;&#39;)</code>, please consider another\napproach, because it almost certainly indicates that something is\nhorribly wrong.\n\n</p>\n",
              "type": "misc",
              "displayName": "`stream.push('')`"
            }
          ]
        }
      ],
      "type": "module",
      "displayName": "Stream"
    }
  ]
}
