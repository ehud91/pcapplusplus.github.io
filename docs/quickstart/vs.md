---
layout: page
title: Quick Start - Visual Studio
nav_exclude: true
permalink: /docs/quickstart/vs
---

# Quick Start - Windows and Visual Studio
{: .no_toc }

This guide will help you install and build your first PcapPlusPlus application on Windows using Visual Studio in a few simple steps.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

## Step 1 - install PcapPlusPlus

Before installing PcapPlusPlus make sure you have the prerequisites installed for [Visual Studio]({{ site.baseurl }}/docs/install/build-source/vs#prerequisites). Please notice that the currently supported versions of Visual Studio are 2015, 2017 and 2019.

Download the pre-compiled package for the Visual Studio version you have (VS2015, VS2017 or VS2019) from the [{{ site.pcapplusplus_ver }} page](https://github.com/seladb/PcapPlusPlus/releases/tag/{{site.pcapplusplus_ver}}).

## Step 2 - create your first app

Go to: `Drive:\path\to\your\package\ExampleProject`.

You can find the following files there:

```shell
 |-- main.cpp
 |-- 1_packet.pcap
 |-- ExampleProject.sln
 |-- ExampleProject.vcxproj
 |-- ExampleProject.vcxproj.filters
 |-- PcapPlusPlusPropertySheet.props
```

`main.cpp` is the example application we'll use.

`1_packet.pcap` is a pcap file the app reads from.

`ExampleProject.sln`, `ExampleProject.vcxproj`, `ExampleProject.vcxproj.filters` are the Visual Studio solution/project files.

`PcapPlusPlusPropertySheet.props` is the PcapPlusPlus properties file.

## Step 3 - configure your solution

Edit the `PcapPlusPlusPropertySheet.props` file in the following way:

- Set the value of the `PcapPlusPlusHome` XML node to the folder where PcapPlusPlus binaries package is located (the one you downloaded)
- Set the value of the `PcapSdkHome` XML node to the folder where WinPcap Developer's Pack / Npcap SDK is located
- Set the value of the `PThreadWin32Home` node to the folder where pthread-win32 is located

## Step 4 - build and run your app

You can now open `ExampleProject.sln` in Visual Studio and build it in the various available configurations (x86/x64 and debug/release).

The `.exe` file will be created under `ExampleProject\Debug\x86` or `ExampleProject\Debug\x64` or `ExampleProject\Release\x86` or `ExampleProject\Release\x64` (according to the chosen configuration). You can now run it and should be able to see the following output:

```shell
Source IP is '10.0.0.138'; Dest IP is '10.0.0.1'
```
