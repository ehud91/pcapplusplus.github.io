---
layout: page
title: 4. Packet Parsing
parent: Tutorials
permalink: /docs/tutorials/packet-parsing
nav_order: 4
---

# Part 4: Packet Parsing
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

## Introduction

Packet parsing, editing and crafting are a major part of PcapPlusPlus and is the essence of the Packet++ library. There is a long list of [protocols currently supported]({{ site.baseurl }}/docs/features#supported-network-protocols), each of them is represented by a `Layer` class which (in most cases) supports both parsing of the protocol, editing and creation of new layers from scratch.

This tutorial will go through the packet parsing fundamentals and the next tutorial will focus on packet crafting and editing. The tutorial demonstrate parsing on a few popular protocols:

* Ethernet
* IPv4
* TCP
* HTTP

For further information about these protocols and the other protocols supported in PcapPlusPlus please go to the [API documentation]({{ site.baseurl }}/docs/api)

## Packet parsing basics

In this tutorial we'll read a packet from a pcap file, let PcapPlusPlus parse it, and see how we can retrieve data from each layer. Let's start by writing a `main()` method and add the includes that we need:

```cpp
#include <iostream>
#include "stdlib.h"
#include "SystemUtils.h"
#include "Packet.h"
#include "EthLayer.h"
#include "IPv4Layer.h"
#include "TcpLayer.h"
#include "HttpLayer.h"
#include "PcapFileDevice.h"

int main(int argc, char* argv[])
{
    // We'll write our code here
}
```

As you can see we added an include to `Packet.h` which contains the basic parsed packet structures, to `PcapFileDevice.h` which contains the API for reading from pcap files and to all of the layers which we want to retrieve information from. In addition we included `SystemUtils.h` for using `netToHost16()` which we'll use later.

Now let's read the packet from the pcap file. This pcap file contains only 1 packet, so we'll open the reader, read the packet and close the reader:

```cpp
// use the IFileReaderDevice interface to automatically identify file type (pcap/pcap-ng)
// and create an interface instance that both readers implement
pcpp::IFileReaderDevice* reader = pcpp::IFileReaderDevice::getReader("1_http_packet.pcap");

// verify that a reader interface was indeed created
if (reader == NULL)
{
    std::cerr << "Cannot determine reader for file type" << std::endl;
    return 1;
}

// open the reader for reading
if (!reader->open())
{
    std::cerr << "Cannot open input.pcap for reading" << std::endl;
    return 1;
}

// read the first (and only) packet from the file
pcpp::RawPacket rawPacket;
if (!reader->getNextPacket(rawPacket))
{
    std::cerr << "Couldn't read the first packet in the file" << std::endl;
    return 1;
}

// close the file reader, we don't need it anymore
reader->close();
```

The next step is to let PcapPlusPlus parse the packet. We do this by creating an instance of the `Packet` class and giving it in the constructor a pointer to the `RawPacket` instance we have:

```cpp
// parse the raw packet into a parsed packet
pcpp::Packet parsedPacket(&rawPacket);
```

Before we dive into the protocols, let's remember how the `Packet` class is [built]({{ site.baseurl }}/docs/tutorials/intro#packets-and-layers): it contains a link list of `Layer` instances, each layer points to the next layer in the packet. In our example: Ethernet layer will be the first one, it will point to IPv4 layer which will point to TCP layer and finally we'll have HTTP request layer. The `Packet` class exposes this link list so we can iterate over the layers and retrieve basic information like the protocols they represent, sizes, etc. Let's see the code:

```cpp
// first let's go over the layers one by one and find out its type, its total length, its header length and its payload length
for (pcpp::Layer* curLayer = parsedPacket.getFirstLayer(); curLayer != NULL; curLayer = curLayer->getNextLayer())
{
    std::cout
        << "Layer type: " << getProtocolTypeAsString(curLayer->getProtocol()) << "; " // get layer type
        << "Total data: " << curLayer->getDataLen() << " [bytes]; " // get total length of the layer
        << "Layer data: " << curLayer->getHeaderLen() << " [bytes]; " // get the header length of the layer
        << "Layer payload: " << curLayer->getLayerPayloadSize() << " [bytes]" // get the payload length of the layer (equals total length minus header length)
        << std::endl;
}
```

As you can see, we're using the `getFirstLayer()` and `getNextLayer()` APIs to iterate over the layers. In each layer we have the following information:

* `getProtocol()` - get an enum of the protocol the layer represents
* `getHeaderLen()` - get the size of the layer's header, meaning the size of the layer data
* `getLayerPayloadSize()` - get the size of the layer's payload, meaning the size of all layers that follows this layer
* `getDataLen()` - get the total size of the layer: header + payload

For printing the protocols I used a simple function that takes a `ProtocolType` enum and returns a string:

```cpp
std::string getProtocolTypeAsString(pcpp::ProtocolType protocolType)
{
    switch (protocolType)
    {
    case pcpp::Ethernet:
        return "Ethernet";
    case pcpp::IPv4:
        return "IPv4";
    case pcpp::TCP:
        return "TCP";
    case pcpp::HTTPRequest:
    case pcpp::HTTPResponse:
        return "HTTP";
    default:
        return "Unknown";
    }
}
```

Let's see the output so far:

```shell
Layer type: Ethernet; Total data: 443 [bytes]; Layer data: 14 [bytes]; Layer payload: 429 [bytes]
Layer type: IPv4; Total data: 429 [bytes]; Layer data: 20 [bytes]; Layer payload: 409 [bytes]
Layer type: TCP; Total data: 409 [bytes]; Layer data: 32 [bytes]; Layer payload: 377 [bytes]
Layer type: HTTP; Total data: 377 [bytes]; Layer data: 377 [bytes]; Layer payload: 0 [bytes]
```

## Parsing Ethernet

Now let's see what information we can get from the first layer in this packet: `EthLayer`. First let's get a pointer to this layer. We can use the methods we used before and cast the `Layer*` to `EthLayer*` but the `Packet` class offers a more convenient way to do that:

```cpp
// now let's get the Ethernet layer
pcpp::EthLayer* ethernetLayer = parsedPacket.getLayerOfType<pcpp::EthLayer>();
if (ethernetLayer == NULL)
{
    std::cerr << "Something went wrong, couldn't find Ethernet layer" << std::endl;
    return 1;
}
```

As you can see we used the templated method `getLayerOfType<pcpp::EthLayer>()` which returns a pointer to `EthLayer` if exists in the packet or NULL otherwise. Now we are ready to start getting some information. The Ethernet layer is quite simple so there's not much information we can get. We can basically get the source and destination MAC addresses and the Ether Type of the next layer:

```cpp
// print the source and dest MAC addresses and the Ether type
std::cout << std::endl
    << "Source MAC address: " << ethernetLayer->getSourceMac() << std::endl
    << "Destination MAC address: " << ethernetLayer->getDestMac() << std::endl
    << "Ether type = 0x" << std::hex << pcpp::netToHost16(ethernetLayer->getEthHeader()->etherType) << std::endl;
```

For getting the source and destination MAC addresses `EthLayer` exposes methods which return an instance of type `MacAddress` which encapsulates MAC addresses and provides helper function such as print the MAC address as a nice string (like we have in our code example). For getting the Ether Type we call `getEthHeader()` which casts the raw packet bytes into a struct: `ether_header*` and we can read the Ether Type from this struct. Since packet raw data is stored in network order, we need to convert the Ether Type value from network to host order using `netToHost16()`

The output is the following:

```shell
Source MAC address: 00:50:43:01:4d:d4
Destination MAC address: 00:90:7f:3e:02:d0
Ether type = 0x800
```

## Parsing IPv4

Now let's get the IPv4 layer, we'll do it in the same way as before using the template `getLayerOfType<pcpp::IPv4Layer>()` method:

```cpp
// let's get the IPv4 layer
pcpp::IPv4Layer* ipLayer = parsedPacket.getLayerOfType<pcpp::IPv4Layer>();
if (ipLayer == NULL)
{
    std::cerr << "Something went wrong, couldn't find IPv4 layer" << std::endl;
    return 1;
}
```

Let's get some information from the `IPv4Layer`:

```cpp
// print source and dest IP addresses, IP ID and TTL
std::cout << std::endl
    << "Source IP address: " << ipLayer->getSrcIPAddress() << std::endl
    << "Destination IP address: " << ipLayer->getDstIPAddress() << std::endl
    << "IP ID: 0x" << std::hex << pcpp::netToHost16(ipLayer->getIPv4Header()->ipId) << std::endl
    << "TTL: " << std::dec << (int)ipLayer->getIPv4Header()->timeToLive << std::endl;
```

As you can see this layer exposes 2 methods for reading the source and destination IP addresses in an easy-to-use wrapper class called `IPv4Address`. This class provides various capabilities, one of them is printing the IP address as a string. Next, we use the `getIPv4Header()` method which casts the raw packet bytes to a struct called `iphdr*` and we can retrieve the rest of the data from there. Since the packet data is in network order, we need to use `netToHost16()` when getting data larger than 1 byte (like when reading the IP ID).

Here is the output:

```shell
Source IP address: 172.16.133.132
Destination IP address: 98.139.161.29
IP ID: 0x36E4
TTL: 64
```

## Parsing TCP

Let's get the TCP layer:

```cpp
// let's get the TCP layer
pcpp::TcpLayer* tcpLayer = parsedPacket.getLayerOfType<pcpp::TcpLayer>();
if (tcpLayer == NULL)
{
    std::cerr << "Something went wrong, couldn't find TCP layer" << std::endl;
    return 1;
}
```

Now let's get the TCP data:

```cpp
// print TCP source and dest ports, window size, and the TCP flags that are set in this layer
std::cout << std::endl
    << "Source TCP port: " << tcpLayer->getSrcPort() << std::endl
    << "Destination TCP port: " << tcpLayer->getDstPort() << std::endl
    << "Window size: " << pcpp::netToHost16(tcpLayer->getTcpHeader()->windowSize) << std::endl
    << "TCP flags: " << printTcpFlags(tcpLayer) << std::endl;
```

The TCP layer exposes two methods: `getPortSrc()` and `getPortDst()` to fetch the source and destination ports. It also exposes the method `getTcpHeader()` to cast the raw packet data into a struct `tpchdr*` which contains all of the TCP fields. That way we can fetch additional fields such as windows size etc. Notice the use of `netToHost16()` to convert the data from network to host byte order as the raw packet arrives in network order. I also wrote a small function that gathers all of the TCP flags on the packet and prints them nicely:

```cpp
std::string printTcpFlags(pcpp::TcpLayer* tcpLayer)
{
    std::string result = "";
    if (tcpLayer->getTcpHeader()->synFlag == 1)
        result += "SYN ";
    if (tcpLayer->getTcpHeader()->ackFlag == 1)
        result += "ACK ";
    if (tcpLayer->getTcpHeader()->pshFlag == 1)
        result += "PSH ";
    if (tcpLayer->getTcpHeader()->cwrFlag == 1)
        result += "CWR ";
    if (tcpLayer->getTcpHeader()->urgFlag == 1)
        result += "URG ";
    if (tcpLayer->getTcpHeader()->eceFlag == 1)
        result += "ECE ";
    if (tcpLayer->getTcpHeader()->rstFlag == 1)
        result += "RST ";
    if (tcpLayer->getTcpHeader()->finFlag == 1)
        result += "FIN ";

    return result;
}
```

Another cool feature `TcpLayer` provides is retrieving information about the TCP options (if exist). We can iterate the TCP options using the methods `getFirstTcpOption()` and `getNextTcpOption(tcpOption)` and extract all the information on the TCP option such as type, length and value. In our example let's iterate over them and print their type:

```cpp
// go over all TCP options in this layer and print its type
std::cout << "TCP options: ";
for (pcpp::TcpOption tcpOption = tcpLayer->getFirstTcpOption(); tcpOption.isNotNull(); tcpOption = tcpLayer->getNextTcpOption(tcpOption))
{
    std::cout << printTcpOptionType(tcpOption.getTcpOptionType()) << " ";
}
std::cout << std::endl;
```

Let's see the method that gets the TCP option type as enum and converts it to string. Notice this method handles only the TCP options we have on the specific packet we're parsing, PcapPlusPlus support all TCP options types:

```cpp
std::string printTcpOptionType(pcpp::TcpOptionType optionType)
{
    switch (optionType)
    {
    case pcpp::PCPP_TCPOPT_NOP:
        return "NOP";
    case pcpp::PCPP_TCPOPT_TIMESTAMP:
        return "Timestamp";
    default:
        return "Other";
    }
}
```

## Parsing HTTP

Finally, let's see the capabilities `HttpRequestLayer` has to offer. First let's extract the layer from the packet:

```cpp
// let's get the HTTP request layer
pcpp::HttpRequestLayer* httpRequestLayer = parsedPacket.getLayerOfType<pcpp::httprequestlayer>();
if (httpRequestLayer == NULL)
{
    std::cerr << "Something went wrong, couldn't find HTTP request layer" << std::endl;
    return 1;
}
```

Of course there is a similar class `HttpResponseLayer` for HTTP responses.

HTTP messages (both requests and responses) have 3 main parts:

* The first line (also known as request-line or status-line) which includes the HTTP version, HTTP method (for requests) or status code (for responses) and the URI (for requests)
* Message headers which include all header fields (e.g host, user-agent, cookie, content-type etc.)
* Message body

The HTTP layer classes provide access to all of these parts. Let's start with showing how to get data from the first line:

```cpp
// print HTTP method and URI. Both appear in the first line of the HTTP request
std::cout << std::endl
    << "HTTP method: " << printHttpMethod(httpRequestLayer->getFirstLine()->getMethod()) << std::endl
    << "HTTP URI: " << httpRequestLayer->getFirstLine()->getUri() << std::endl;
```

As you can see the `HttpRequestLayer` class exposes a getter (`getFirstLine()`) that retrieves an object of type `HttpRequestFirstLine` that contain all of the first-line data: method, URI,etc. The method is returned as an enum so I added a simple function `printHttpMethod` to print it as a string:

```cpp
std::string printHttpMethod(pcpp::HttpRequestLayer::HttpMethod httpMethod)
{
    switch (httpMethod)
    {
    case pcpp::HttpRequestLayer::HttpGET:
        return "GET";
    case pcpp::HttpRequestLayer::HttpPOST:
        return "POST";
    default:
        return "Other";
    }
}
```

Now let's see how to get header fields data:

```cpp
// print values of the following HTTP field: Host, User-Agent and Cookie
std::cout
    << "HTTP host: " << httpRequestLayer->getFieldByName(PCPP_HTTP_HOST_FIELD)->getFieldValue() << std::endl
    << "HTTP user-agent: " << httpRequestLayer->getFieldByName(PCPP_HTTP_USER_AGENT_FIELD)->getFieldValue() << std::endl
    << "HTTP cookie: " << httpRequestLayer->getFieldByName(PCPP_HTTP_COOKIE_FIELD)->getFieldValue() << std::endl;
```

The HTTP request and response layers exposes a method `getFieldByName()` to get a header field data by it's name. The class representing a field is called `HttpField` and has some interesting API, but probably the most important method for parsing is `getFieldValue()` which returns the value of this header field as string. Please notice that I didn't write the header field names as strings but rather used a macro defined in PcapPlusPlus for some of the most useful HTTP fields (like host, cookie, user-agent, etc.).

Finally, let's see another cool method in `HttpRequestLayer` which is `getURL()` that forms and returns the full URL from the request (including host-name from "Host" header field + URI from the request-line):

```cpp
// print the full URL of this request
std::cout << "HTTP full URL: " << httpRequestLayer->getUrl() << std::endl;
```

Now let's see the output:

```shell
HTTP method: GET
HTTP URI: /serv?s=19190039&t=1361916157&f=us-p9h3
HTTP host: geo.yahoo.com
HTTP user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/534.55.3 (KHTML, like Gecko) Version/5.1.3 Safari/534.53.10
HTTP cookie: B=fdnulql8iqc6l&b=3&s=ps
HTTP full URL: geo.yahoo.com/serv?s=19190039&t=1361916157&f=us-p9h3
```

## Running the example

All code that was covered in this tutorial can be found [here](https://github.com/seladb/PcapPlusPlus/tree/{{site.github_label}}/Examples/Tutorials/Tutorial-PacketParsing). In order to compile and run the code please first download and compile PcapPlusPlus code or downloaded a pre-compiled version from the [{{ site.pcapplusplus_ver }} release](https://github.com/seladb/PcapPlusPlus/releases/tag/{{site.pcapplusplus_ver}}). Then follow these instruction, according to your platform:

* Linux, MacOS, FreeBSD - make sure PcapPlusPlus is installed (by running **sudo make install** in PcapPlusPlus main directory). Then either change the `Makefile.non_windows` file name to `Makefile` and run `make all`, or run `make -f Makefile.non_windows all`
* Windows using MinGW or MinGW-w64 - either change the `Makefile.windows` file name to `Makefile` and run `make all`, or run `make -f Makefile.windows all`
* Windows using Visual Studio - there is a Visual Studio solution containing all tutorials: `mk\[vs_version]\Tutorials.sln`. Just open it and compile all tutorials

In all options the compiled executable will be inside the tutorial directory (`[PcapPlusPlus Folder]/Examples/Tutorials/Tutorial-PacketParsing`)
