---
layout: page
title: Running tests
permalink: /docs/tests
nav_order: 10
---

# Running PcapPlusPlus Tests
{: .no_toc }

PcapPlusPlus source code contains a set of test-cases you can run to make sure everything works correctly on your system.

These test-cases are divided into three separate projects:

- `[PCAPPPLUSPLUS_HOME]/Tests/Packet++Test` - contains test-cases for the `Packet++` library
- `[PCAPPPLUSPLUS_HOME]/Tests/Pcap++Test` - contains test-cases (mostly) for the `Pcap++` library
- `[PCAPPPLUSPLUS_HOME]/Tests/ExamplesTest` - contains test-cases for PcapPlusPlus examples

When you build PcapPlusPlus these projects are also built. The following sections contain information on how to run the test-cases:

1. TOC
{:toc}

## Packet++Test

This project contains test-cases that mostly test the `Packet++` library, meaning testing the functionality of parsing and crafting packets of different protocols.

After a successful build you can run these test-cases by following these simple steps:

{% include alert.html alert-type="notice" content="The steps below are shown on Linux but apply in the same way to all supported platforms" %}

- Go to `Packet++Test` directory:

  ```shell
  seladb@seladb:~/PcapPlusPlus$ cd Tests/Packet++Test/
  seladb@seladb:~/PcapPlusPlus/Tests/Packet++Test$
  ```

- Run the tests from this directory. The executable is inside the `Bin` directory:

  ```shell
  seladb@seladb:~/PcapPlusPlus/Tests/Packet++Test$ Bin/Packet++Test 
  PcapPlusPlus version: {{ site.pcapplusplus_ver }} (official release)
  Built: MMM DD YYYY 02:36:16
  Built from: Git branch 'master', commit '8b2d721fdaaa6af516494d96f032e10264d7bf56'
  Start running tests...

  EthPacketCreation             : PASSED
  EthPacketPointerCreation      : PASSED
  EthAndArpPacketParsing        : PASSED
  ArpPacketCreation             : PASSED
  VlanParseAndCreation          : PASSED
  Ipv4PacketCreation            : PASSED
  ...
  ...
  ...
  ALL TESTS PASSED!!
  Test cases: 92, Passed: 92, Failed: 0, Skipped: 0
  ```

- Hopefully if all tests pass you'll see a message at the end saying `ALL TESTS PASSED!!` and the number of test-cases that passed, skipped or failed. You'll also see next to each test-case whether it has passed or failed.

- If a test-case failed you'll see an appropriate assert message explaining what caused the failure, for example:

  ```shell
  seladb@seladb:~/PcapPlusPlus/Tests/Packet++Test$ Bin/Packet++Test 
  PcapPlusPlus version: {{ site.pcapplusplus_ver }} (official release)
  Built: MMM DD YYYY 02:44:35
  Built from: Git branch 'master', commit '8b2d721fdaaa6af516494d96f032e10264d7bf56'
  Start running tests...

  EthPacketCreation             : PASSED
  EthPacketPointerCreation      : PASSED
  EthAndArpPacketParsing        : PASSED
  ArpPacketCreation             : FAILED (line: 245). assert equal failed: actual: 42 != expected: 43
  VlanParseAndCreation          : PASSED
  Ipv4PacketCreation            : PASSED
  ...
  ...
  ...
  NOT ALL TESTS PASSED!!
  Test cases: 92, Passed: 91, Failed: 1, Skipped: 0
  ```

- Please note that it's very important to run the tests from the `Tests/Packet++Test` directory (using `Bin/Packet++Test`) because the test-cases are using packet examples that reside in [Tests/Packet++Test/PacketExamples](https://github.com/seladb/PcapPlusPlus/tree/{{site.github_label}}/Tests/Packet%2B%2BTest/PacketExamples) and are assuming the running directory is `Tests/Packet++Test`


### Some more technical details

- The folder structure of `Packet++Test` is as follows (showing only relevant folders):
  ```text
  |- Bin/
  |- PacketExamples/
  |- Tests/
     |- BgpTests.cpp
     |- DhcpTests.cpp
     |- DnsTests.cpp
     |- ...
     |- ...
  |- Utils/
  |- main.cpp
  |- Makefile
  |- TestDefinition.h
  |- ...
  |- ...
  ```

  The test-cases are gathered under the `Tests/` folder. Each file in this folder contains a few test-cases which belong to a specific protocol or subject. 
  
  The `PacketExamples/` folder contains packet examples used by the various test-cases.

  `Bin/` contains the executable.

  `Utils/` contains a few methods commonly used by the test-cases. 

  `TestDefinition.h` contains a definition of all the test-cases and `main.cpp` is in charge of parsing command-line arguments and running the tests.

- Each test-case resides in one of the `.cpp` files under `Packet++Test/Tests/` and has the following definition:

  ```cpp
  PTF_TEST_CASE(GtpLayerParsingTest)
  {
      ...
      ...
  }
  ```

  In addition this test needs to be declared in `Packet++Test/TestDefinition.h`:

  ```cpp
  ...
  ...
  // Implemented in GtpTests.cpp
  PTF_TEST_CASE(GtpLayerParsingTest);
  ...
  ...
  ```

- In addition to the functional tests described in each test-case there is also a memory leak test that is being performed for each test-case separately. The [MemPlumber](https://github.com/seladb/MemPlumber) library is being used to detect memory leaks. If a memory leak is detected the test-case will fail with an appropriate assert message

- Each test-case has one or more tags assigned to it. The tags are defined when calling each test-case in `Packet++Test/main.cpp`. For example: `PTF_RUN_TEST(EthPacketCreation, "eth")` has the tag "eth" assigned to it, while `PTF_RUN_TEST(SipResponseLayerCreationTest, "sip")` has the "sip" tag assigned to it. In addition there is a default tag assigned to each test-case which is its name. This mechanism allows running specific tests instead of always running all of them. There is a command-line switch __`-t`__ or __`--tags`__ which enables running only tests that are assigned to specific tags. You should provide it a list of tags (one or more) separated by a semicolon and surrounded by quotes.

  For example, the following command will run only tests that have the "`eth`" tag assigned to them:

  ```shell
  seladb@seladb:~/PcapPlusPlus/Tests/Packet++Test$ Bin/Packet++Test -t "eth"
  PcapPlusPlus version: {{ site.pcapplusplus_ver }} (official release)
  Built: MMM DD YYYY 03:19:34
  Built from: Git branch 'master', commit '8b2d721fdaaa6af516494d96f032e10264d7bf56'
  Start running tests...

  EthPacketCreation             : PASSED
  EthPacketPointerCreation      : PASSED
  EthAndArpPacketParsing        : PASSED
  EthDot3LayerParsingTest       : PASSED
  EthDot3LayerCreateEditTest    : PASSED

  ALL TESTS PASSED!!
  Test cases: 92, Passed: 5, Failed: 0, Skipped: 87
  ```

  As you can see 5 test-cases matched the `eth` tag and the rest of them (87) were skipped and are not showing on the report.

  This command will run only test-cases which have "`eth`" or "`ipv6`" tags assigned to them:

  ```shell
  seladb@seladb:~/PcapPlusPlus/Tests/Packet++Test$ Bin/Packet++Test -t "eth;ipv6"
  PcapPlusPlus version: {{ site.pcapplusplus_ver }} (official release)
  Built: MMM DD YYYY 03:19:34
  Built from: Git branch 'master', commit '8b2d721fdaaa6af516494d96f032e10264d7bf56'
  Start running tests...

  EthPacketCreation             : PASSED
  EthPacketPointerCreation      : PASSED
  EthAndArpPacketParsing        : PASSED
  EthDot3LayerParsingTest       : PASSED
  EthDot3LayerCreateEditTest    : PASSED
  IPv6UdpPacketParseAndCreate   : PASSED
  IPv6FragmentationTest         : PASSED
  IPv6ExtensionsTest            : PASSED

  ALL TESTS PASSED!!
  Test cases: 92, Passed: 8, Failed: 0, Skipped: 84
  ```

  This command will run only the "`ArpPacketCreation`" test-case:

  ```shell
  seladb@seladb:~/PcapPlusPlus/Tests/Packet++Test$ Bin/Packet++Test -t "ArpPacketCreation"
  PcapPlusPlus version: {{ site.pcapplusplus_ver }} (official release)
  Built: MMM DD YYYY 03:19:34
  Built from: Git branch 'master', commit '8b2d721fdaaa6af516494d96f032e10264d7bf56'
  Start running tests...

  ArpPacketCreation             : PASSED

  ALL TESTS PASSED!!
  Test cases: 92, Passed: 1, Failed: 0, Skipped: 91
  ```

- Here are all of the command-line switches available for `Packet++Test`:

  | __`-t`__, __`--tags`__                | Run only test-cases that match specific tags. The tag list should be separated by semicolons and surrounded by apostrophes, for example: `Bin/Packet++Test -t "eth;ipv4;ArpPacketCreation"` |
  | __`-w`__, __`--show-skipped-tests`__  | Show tests that are skipped. By default they are hidden in the final report |
  | __`-v`__, __`--verbose`__             | Run in verbose mode which emits more output in several test-cases |
  | __`-m`__, __`--mem-verbose`__         | Output verbose information on all memory allocations and releases done throughout the test-cases. This can be useful to detect memory leaks |
  | __`-s`__, __`--skip-mem-leak-check`__ | Skip memory leak test for all test-cases |
  | __`-h`__, __`--help`__                | Shows a help screen with the available command-line switches |


## Pcap++Test

This project contains test-cases that mostly test for the `Pcap++` library, meaning testing the functionality of capturing and sending network packets, reading and writing to files, DPDK functionality, PF_RING and more. It also contains tests for massive packet parsing, TCP reassembly and IP de/fragmentation.

After a successful build you can run these test-cases by following these simple steps:

{% include alert.html alert-type="notice" content="The steps below are shown on Linux but apply in the same way to all supported platforms" %}

- Make sure that network traffic is flowing to the device you're running the tests on. This is important because some of the test-cases assume incoming packets. There is also an option to run only test-cases that don't rely on live traffic using the `-n` or `--no-networking` command-line switch

- Go to `Pcap++Test` directory:

  ```shell
  seladb@seladb:~/PcapPlusPlus$ cd Tests/Pcap++Test/
  seladb@seladb:~/PcapPlusPlus/Tests/Pcap++Test$
  ```

- Run the tests from this directory. The executable is inside the `Bin` directory. If you're running with live traffic there is a mandatory command-line switch you need to provide "`-i`" or "`--use-ip`" which is the IP address of the interface you'd like the test suite to use for capturing and sending network traffic. Make sure that network traffic is flowing to that interface:

  ```shell
  seladb@seladb:~/PcapPlusPlus/Tests/Pcap++Test$ sudo Bin/Pcap++Test -i 10.0.0.1
  PcapPlusPlus version: {{ site.pcapplusplus_ver }} (official release)
  Built: MMM DD YYYY 02:36:38
  Git info: Git branch 'master', commit '8b2d721fdaaa6af516494d96f032e10264d7bf56'
  Using ip: 10.0.0.1
  Debug mode: off
  Start running tests...

  TestIPAddress                 : PASSED
  TestMacAddress                : PASSED
  TestLRUList                   : PASSED
  TestGeneralUtils              : PASSED
  TestGetMacAddress             : PASSED
  TestPcapFileReadWrite         : PASSED
  ...
  ...
  ALL TESTS PASSED!!
  Test cases: 65, Passed: 50, Failed: 0, Skipped: 15
  ```

- Notice that on Linux and MacOS you might need to run with `sudo`

- Hopefully if all test cases pass you'll see a message at the end saying `ALL TESTS PASSED!!` and the number of test-cases that passed, skipped or failed. You’ll also see next to each test-case whether it has passed or failed.

- If a test-case failed you'll see an appropriate assert message explaining what caused the failure, for example:

  ```shell
  seladb@seladb:~/PcapPlusPlus/Tests/Pcap++Test$ sudo Bin/Pcap++Test -i 10.1.1.1
  PcapPlusPlus version: {{ site.pcapplusplus_ver }} (official release)
  Built: MMM DD YYYY 02:36:38
  Git info: Git branch 'master', commit '8b2d721fdaaa6af516494d96f032e10264d7bf56'
  Using ip: 10.1.1.1
  Debug mode: off
  Starting tests...
  Start running tests...

  TestIPAddress                 : PASSED
  TestLRUList                   : PASSED
  TestPcapFileReadWrite         : PASSED
  ..
  ..
  TestPcapLiveDeviceList        : PASSED
  TestPcapLiveDeviceListSearch  : FAILED. assertion failed: Device used in this test 10.1.1.1 doesnt exist
  ..
  ..
  ```

- Please note that it's very important to run the tests from the `Tests/Pcap++Test` directory (using `Bin/Pcap++Test`) because the test-cases are using packet examples that reside in [Tests/Pcap++Test/PcapExamples](https://github.com/seladb/PcapPlusPlus/tree/{{site.github_label}}/Tests/Pcap%2B%2BTest/PcapExamples) and are assuming the running directory is `Tests/Pcap++Test`

- If you're building PcapPlusPlus with DPDK there is an additional mandatory command-line parameter which is "`-k`" or "`--dpdk-port`" where you need to provide the DPDK port to use for the tests. This port is simply a number starting from 0, so if you have only one interface assigned to DPDK the port number will be 0. If you have two interfaces assigned to DPDK then you can choose either 0 or 1, and so on. Please make sure there is network traffic flowing to this interface


### Some more technical details

- The folder structure of `Pcap++Test` is as follows (showing only relevant folders):

  ```text
  |- Bin/
  |- Common/
  |- PcapExamples/
  |- Tests/
     |- DpdkTests.cpp
     |- FileTests.cpp
     |- FilterTests.cpp
     |- ...
     |- ...
  |- main.cpp
  |- Makefile
  |- TestDefinition.h
  |- ...
  |- ...
  ```

  The test-cases are gathered under the `Tests/` folder. Each file in this folder contains a few test-cases which belong to a specific subject. 
  
  The `PcapExamples/` folder contains pcap files used by the various test-cases.

  `Bin/` contains the executable.

  `Common/` contains a few methods commonly used by the test-cases. 

  `TestDefinition.h` contains a definition of all the test-cases and `main.cpp` is in charge of parsing command-line arguments and running the tests.

- Each test-case resides in one of the `.cpp` files under `Pcap++Test/Tests/` and has the following definition:

  ```cpp
  PTF_TEST_CASE(TestPcapLiveDevice)
  {
      ...
      ...
  }
  ```

  In addition this test needs to be declared in `Pcap++Test/TestDefinition.h`:

  ```cpp
  ...
  ...
  // Implemented in GtpTests.cpp
  PTF_TEST_CASE(TestPcapLiveDevice);
  ...
  ...
  ```

- In addition to the functional tests described in each test-case there is also a memory leak test that is being performed for each test-case separately. The [MemPlumber](https://github.com/seladb/MemPlumber) library is being used to detect memory leaks. If a memory leak is detected the test-case will fail with an appropriate assert message

- There is a tag mechanism which is similar to the one implemented in `Packet++Test`. Please refer to [the section](#some-more-technical-details) to learn more about this functionality

- Here are all of the command-line switches available for `Pcap++Test`:

  | __`-i`__, __`--use-ip`__              | IP address to use for sending and receiving packets. It's a mandatory parameter when running the tests with live network traffic |
  | __`-d`__, __`--debug-mode`__          | Set log level to DEBUG for all test-cases |
  | __`-r`__, __`--remote-ip`__	          | IPv4 address of remote machine running rpcapd to test remote capture (currently relevant only for Windows). If not provided then the IPv4 address provided in `-i` switch will be used |
  | __`-p`__, __`--remote-port`__         | Port of remote machine running rpcapd to test remote capture (currently relevant only for Windows). If not provided the default port is `12321` |
  | __`-k`__, __`--dpdk-port`__           | The DPDK NIC port to use. Required only if compiling with DPDK |
  | __`-a`__, __`--kni-ip`__              | IPv4 address for the KNI device test-cases. Relevant only for Linux systems and if compiling with DPDK and KNI. Must not be the same as any of existing network interfaces in your system. If this parameter is omitted KNI tests will be skipped |
  | __`-n`__, __`--no-networking`__       | Do not run tests that requires networking |
  | __`-t`__, __`--tags`__                | Run only test-cases that match specific tags. The tag list should be separated by semicolons and surrounded by apostrophes, for example: `Bin/Pcap++Test -t "live_device;pf_ring;TestDpdkDevice"` |  
  | __`-w`__, __`--show-skipped-tests`__  | Show tests that are skipped. By default they are hidden in the final report |
  | __`-v`__, __`--verbose`__             | Run in verbose mode which emits more output in several test-cases |
  | __`-m`__, __`--mem-verbose`__         | Output verbose information on all memory allocations and releases done throughout the test-cases. This can be useful to detect memory leaks |
  | __`-s`__, __`--skip-mem-leak-check`__ | Skip memory leak test for all test-cases |
  | __`-t`__, __`--tags`__                | Run only test-cases that match specific tags. The tag list should be separated by semicolons and surrounded by apostrophes, for example: `Bin/Pcap++Test -t "live_device;pf_ring;TestDpdkDevice"` |
  | __`-h`__, __`--help`__                | Shows a help screen with the available command-line switches |


## ExamplesTest

This project is quite different and unique from the other two in various ways:
- It doesn't test any parts of the PcapPlusPlus library but rather the [example apps]({{ site.baseurl }}/docs/examples) that are provided with the library
- It doesn't test the apps code but rather runs them as executables and inspects their output (stdout, generated files, etc.)
- This project isn't written in C++ but rather in Python. The reason is that Python is much more "user-friendly" when it comes to running executables and inspect their output; its file and string manipulation options are much more comprehensive and advanced. You can write very little code and achieve a lot. Python also has great testing frameworks that come out-of-the-box. It is the obvious choice for these kind of tasks

Because this project is written in Python it has different requirements and setup/run procedures. First we'll go over the requirements, then we'll dive into the setup and finally we'll show how to run the tests and explore the command-line options available.

### Requirements

- This project requires [Python 3.7](https://www.python.org/downloads/) or newer. It won't run on Python 2.7.x
- It has dependencies on other Python libraries described in [`requirements.txt`](https://github.com/seladb/PcapPlusPlus/blob/{{site.github_label}}/Tests/ExamplesTest/requirements.txt). In the next section we'll go into the details of how to install them

### Setup

This section describes the steps to get to a working setup:

{% include alert.html alert-type="notice" content="The steps below are shown on Linux but apply in the same way to all supported platforms" %}

- Make sure you have Python 3.7 or newer. You can check the version using the `-V` command line option:

  ```shell
  seladb@seladb:~$ python3 -V
  Python 3.8.2
  ```

- Go into the `ExamplesTest` directory:

  ```shell
  seladb@seladb:~$ cd PcapPlusPlus/Tests/ExamplesTest
  seladb@seladb:~/PcapPlusPlus/Tests/ExamplesTest$
  ```

- If you'd like to use [venv/virtualenv](https://docs.python.org/3/library/venv.html) (which is usually recommended in Python) create the virtual environment and activate it:

  ```shell
  seladb@seladb:~/PcapPlusPlus/Tests/ExamplesTest$ python3 -m venv venv
  seladb@seladb:~/PcapPlusPlus/Tests/ExamplesTest$ source venv/bin/activate
  (venv) seladbseladb:~/PcapPlusPlus/Tests/ExamplesTest$ 
  ```
- Install the dependencies described in [`requirements.txt`](https://github.com/seladb/PcapPlusPlus/blob/{{site.github_label}}/Tests/ExamplesTest/requirements.txt):

  ```shell
  (venv) seladb@seladb:~/PcapPlusPlus/Tests/ExamplesTest$ python3 -m pip install -r requirements.txt
  ```

- Since this test suite simply runs the app executables make sure you have a [working build of PcapPlusPlus]({{ site.baseurl }}/docs/install#build-from-source) and that the executables are under `[PcapPlusPlus-Home]/Dist/examples`

### Running the tests

Once you have a working setup running the tests is pretty easy:

```
(venv) seladbseladb:~/PcapPlusPlus/Tests/ExamplesTest$ python3 -m pytest
```

Here is the output you might see:

```shell
============== test session starts ===============
platform linux -- Python 3.8.2, pytest-5.4.3, py-1.9.0, pluggy-0.13.1
rootdir: /home/seladb/PcapPlusPlus/Tests/ExamplesTest, inifile: pytest.ini
collected 57 items                               

tests/test_arping.py ss.s                  [  7%]
tests/test_dnsresolver.py x..s             [ 14%]
tests/test_httpanalyzer.py ...             [ 19%]
tests/test_ipdefragutil.py ......          [ 29%]
tests/test_ipfragutil.py .......           [ 42%]
tests/test_pcapprinter.py ....             [ 49%]
tests/test_pcapsearch.py ........          [ 63%]
tests/test_pcapsplitter.py ............... [ 89%]
tests/test_sslanalyzer.py ..               [ 92%]
tests/test_tcpreassembly.py ....           [100%]

=== 52 passed, 4 skipped, 1 xfailed in 16.06s ====
```

This output shows how many test-cases passed, how many failed and how many were skipped or [xfailed](https://docs.pytest.org/en/latest/skipping.html).

{% include alert.html alert-type="notice" content="As you can see currently not all of the example apps are covered. This is because some of them are difficult to test by just running the executable and need a more complex setup. In the future we'll consider increasing the coverage" %}

This project uses [pytest](https://docs.pytest.org/) which is one of the most popular test frameworks for Python. It has many features and options that will not be covered in this guide, but here are the options that are most relevant for this project:

| __`--use-sudo`__  | Some of the tests rely on live network traffic and need access to a network interface. On Linux and MacOS this may require `sudo` privileges. If this flag is set the test-cases will use `sudo` to run the relevant executables. If `sudo` is required and this flag is not set these tests may fail |
| __`--interface [interface-ip]`__ | Required only for tests who rely on live network traffic and need the network interface IP address to use. If this parameter is not provided these tests will be skipped |
| __`--gateway [gateway_ip]`__     | A small set of tests need the default gateway IP address. If this parameter is not provided these tests will be skipped |
| __`-m [marker]`__                | pytest has this concept of [markers](https://docs.pytest.org/en/stable/mark.html) which is like tagging tests with metadata. This project uses it to tag test-cases by app or those who need/don't need network traffic. The markers relevant to this project are described in the next table |
| __`--markers`__                  | Show a list of all the markers available (not all of them are specific to this project) |
| __`--help`__                     | Show all of `pytest` command-line options |

Here are the markers that are relevant to this project:

| __`-m no_network`__     | Run only test-cases that don't require live network traffic. This is very useful for environments where live traffic is not available or if you prefer to run tests that don't interact with the network. The test-cases which require network traffic will be skipped |
| __`-m pcapprinter`__    | Run only test-cases for [PcapPrinter]({{ site.baseurl }}/docs/examples#pcapprinter)     |
| __`-m ipdefragutil`__   | Run only test-cases for [IPDefragUtil]({{ site.baseurl }}/docs/examples#ipdefragutil)   |
| __`-m ipfragutil`__     | Run only test-cases for [IPFragUtil]({{ site.baseurl }}/docs/examples#ipfragutil)       |
| __`-m dnsresolver`__    | Run only test-cases for [DNSResolver]({{ site.baseurl }}/docs/examples#dnsresolver)     |
| __`-m tcpreassembly`__  | Run only test-cases for [TcpReassembly]({{ site.baseurl }}/docs/examples#tcpreassembly) |
| __`-m httpanalyzer`__   | Run only test-cases for [HttpAnalyzer]({{ site.baseurl }}/docs/examples#httpanalyzer)   |
| __`-m sslanalyzer`__    | Run only test-cases for [SSLAnalyzer]({{ site.baseurl }}/docs/examples#sslanalyzer)     |
| __`-m pcapsearch`__     | Run only test-cases for [PcapSearch]({{ site.baseurl }}/docs/examples#pcapsearch)       |
| __`-m arping`__         | Run only test-cases for [Arping]({{ site.baseurl }}/docs/examples#arping)               |
| __`-m pcapsplitter`__   | Run only test-cases for [PcapSplitter]({{ site.baseurl }}/docs/examples#pcapsplitter)   |
