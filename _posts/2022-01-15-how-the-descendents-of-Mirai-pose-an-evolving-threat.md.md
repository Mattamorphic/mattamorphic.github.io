---
layout: post
title: How the desendents of Mirai pose an evolving threat
date: "2022-01-15 10:05:00 +0000"
categories: security
---
### A look at Mirai and the subsequent variants since the infamous 2016 DDoS attack

### Abstract
Since being open sourced in 2016, and following the impact of the Dyn attack, Mirai has spawned a number of variants, each adding new features and functionality. Every iteration has looked to either improve the scale of the botnet by increasing the amount of vulnerabilities used (alongside the dictionary attack) as is the case with Satori and SMMR1, maintain access and persist the bots as is the case with Katana, or assimilate other botnets as is the case with ZHTrap. Mirai continues to evolve and proves to be a continued threat.

### Introduction
In August 2016 the white-hat organization MalwareMustDie [1] discovered a Malware binary with the name Mirai targeting IoT devices. 

At the end of September 2016, the source code for Mirai was leaked on a community hacking forum [2] - becoming readily available for both security researchers and malicious actors.

On the 21st October 2016, a Mirai botnet, leveraging approximately 100,000 [3] IoT devices, performed multiple DDoS (Distributed Denial of Service) attacks against the Dyn DNS (Domain Name System) services causing major internet platforms to become unavailable through their URLs (Uniform Resource Locator).

At the time this was the largest DDoS attack in history [4] with attack traffic peaking at an estimated 1.2Tbps.

Since being open sourced there have been upwards of 60 variants of Mirai based on the original source code with new features, functionality and iteration on the attack vectors / methodologies [5]. The most recent being ZHtrap - discovered by Unit 42 researchers on the 16th February 2021, and published on the 15th March 2021 [6]. Security professionals have come to accept that Mirari, and it’s variants, are the “new normal of DDoS attacks” [7].

This paper will explore several variants since 2016, looking at how the descendants have evolved from the original version of Mirai

The key variants that will be explored are; Satori [8], SMMR1 [9], Katana [10], and ZHtrap [6]

### Botnets

#### Overview
A bot is an application that runs predetermined automated commands across the internet, commonly simple, repeated commands in rapid succession. A legitimate use for bots is in web crawling - fetching web resources, analysing the contents and header information, and labelling this information accordingly. 

A botnet describes a group of internet connected devices that have been compromised by an attacker and whereby each device has been converted into a bot by the attacker deploying malware.

The attacker is able to control, and coordinate this botnet through the internet connected nature of the devices using network based communication.

#### Use in DDoS
DDoS botnet attacks rely on a C&C server (command and control) that issues commands to each of the bots in the network, the attacker interfaces with the botnet through the C&C. Botnets have a number of advantages over other DDoS vectors, the attacker is concealed behind the bot victims, the attack capacity is proportionate to the size of the botnet, and a botnet can be globally dispersed - making it difficult to mitigate.

### Worms
Bot’s are often added to a botnet through the “worm” approach of propagation. A “worm” based malware replicates itself in order to spread to other devices across a network. Once a target device is identified the malware exploits a security hole in the device to gain access. Once it has access it uses this host to identify other targets, and repeats the process,

### Mirai

#### Overview
The Mirai botnet uses the “worm” approach in the context of IoT devices - scanning, exploiting, and replicating.

As discussed by Imperva [11] Mirai is composed of 2 core modules: 

#### The “Attack Module” 
The C&C server (written in Go) used by the attacker to coordinate the bots in the botnet and launch DDoS attacks against the target(s).

#### The “Replication Module” 
The bot code (written in C) that is deployed to the devices and used to locate further devices, compromise these, and grow the botnet (as well as listening for instructions from the C&C).

#### Replication
Mirai constantly scans across a wide range of IP addresses looking for potentially exploitable target IoT devices. It does this by sending TCP SYN packets to a random selection of IPv4 addresses using ports 23 and 2323. SYN stands for synchronize and is used by a client and server to synchronize and set up a TCP connection - no payload is sent at this stage. SYN scanning is a popular technique used by malicious actors to determine the state of a port on a target device without setting up a full connection [12]- if the server responds with either it’s own SYN (or ACK) packet - then it means the port is open.

Once a device is identified, and the port is deemed to be open, Mirai uses a brute force approach, dictionary attack, of common and factory default credentials to attempt to access the device.

If the device is successfully compromised, it reports this back to the C&C, which then delivers the Mirai malware, converting the device into a bot [13].

Once the binary has been delivered and the process is running, Mirari deletes the binary to cover its tracks - and tries to obfuscate the process name. Interestingly Mirari also looks to remove any other Malware on the device, and kill any other processes that might be bound to the ports that the attack came in on [11].

#### Attack
When launching an attack the C&C issues attack commands to the bots in the botnet. Mirai uses a combination of HTTP flooding attacks, and other Transport / Network layer attacks. A HTTP flood attack is where the attacker generates a vast amount of traffic of what appear to be valid HTTP requests to a web server with the goal of limiting availability of a given resource.

Mirai attempts to mask these attacks from the bots by disguising the requests behind valid user agent signatures in the HTTP request headers.

Although Mirai provides these built in commands for leveraging the amplified bandwidth against a target, the types of Attack are largely based on the malicious actors intent [14].

“These attacks employed a range of different resource exhaustion strategies: 32.8% were volumetric, 39.8% were TCP state exhaustion, and 34.5% were application-layer attacks”

The October 21 2016 attack on Dyns infrastructure was orchestrated by leveraging the available devices to perform a SYN flood attack [15].

As mentioned in “Replication” - these are small packets used to synchronize a client and a server before establishing a TCP connection. A SYN flood attack is a common denial of service attack in which an attacker sends SYN packets in quick succession without completing the connection, leaving the server to assign resources waiting to fulfil this connection request. With enough requests the available resources are consumed and the server becomes unresponsive to other requests from valid clients.

Figure 1. Example of Mirai replication and attack

#### Defense
As the victim of a mirai attack, there are techniques available to mitigate and defend against DDoS attacks. The key steps in defense are:
- Prevention - protection against DDoS attacks prior to launch
- Identification - distinguishing between regular conditions, and normal traffic, as well as traffic that is unusual or a potential threat.
- Mitigation / Response - determining what traffic should be allowed, and what traffic should be blocked or discarded

##### Prevention
Prevention considers ways that systems can be protected against DDoS threats to maintain business availability.

###### Rate Limiting
Rate limiting is a common defense technique used to handle increased traffic - restricting traffic flow based on a characteristic of the traffic - whether that is the IP, the connections per second, or the types of requests coming in (i.e. SYN). The trade off in this case, is restricting traffic to maintain availability.

A drawback of this, similar to RTBH, is that rate limiting is an all or nothing solution as it doesn’t distinguish between legitimate and illegitimate traffic.

##### Caching
In this article [16] the author discusses the impact caching can have on improving resilience against DDoS attacks as a preventative method. 

Given that DDoS attacks are commonly used to attack web infrastructure a common target is web servers - in which the attack makes a vast number of layer 7 HTTP requests to request a web page. When a web server receives a clients HTTP request, it composes and returns the client code for the requested resource.

This compilation process can be computationally expensive, potentially generating internal requests, to other services (i.e.  database server), which can also have computationally expensive tasks - and so on. 

Leveraging caching where possible reduces the amount of computation required to return a requested resource - and in many cases, negates the load on other internal services, by storing and fetching the compiled response, or the components of the response in memory..

Common in-memory solutions such as Redis, and Memcached, act as key value stores allowing the server to store a fetched resource by a unique key and fetch this when required.

Caching is an effective strategy in resilience and prevention against DDoS attacks as well as improving general overall performance. 

There are drawbacks however, not everything can be cached (highly dynamic content), and some caching solutions potentially introduce their own vulnerabilities.

An example of a vulnerability, that led to the biggest DDoS attack in history in 2018, leveraged a vulnerability in Memcached [17]. Attackers sent spoof UDP requests (with the victims IP address) to the memcached server, which responded with its own request. Believing the UDP request came from the victims IP address - it sends the response to that IP. UDP data to be sent back to the requester, before the connection is completely established - therefore attackers could trigger vast numbers of requests and amplify this attack.

#### Identification
Detection and identification can be grouped into 2 distinct buckets. 

The first is pattern matching, whereby traffic is compared against common patterns to determine if the traffic is legitimate. This method relies on the patterns being kept updated and is a reactive approach to handling detection - a target has to be attacked at least once in order for a new instance of the traffic to be identified and a new pattern generated.
The second is to, instead of matching traffic against predefined patterns, compare traffic against the regular traffic flowing through the system. Anomaly detection is powerful as it is likely to detect new attacks and traffic - however it is more likely, early on, to return false positives - as well as highlight all anomalies and not specifically DDoS attacks.

With the advancements in machine learning there are approaches that are derived from both of these approaches [18], whereby the training of machine learning models is completed using existing data - and new traffic is passed through this model to predict the legitimacy. Machine learning detection systems are dependent on the quality of the data that is used to train them - if the data is poor, or heavily biased, then the model will provide inaccurate results.

#### Mitigation / Response
Mitigation and response deals with handling this traffic during a DDoS attack, for instance filtering out packets, or routing illegitimate traffic away from the infrastructure.

##### Deep Packet Inspection
Deep Packet Inspection (DPI) [19] is a packet filtering technique whereby the header and data of packets are inspected - and either allowed or filtered based on how they compare with a set of pre-defined criteria - instead of traditional packet filtering approaches that examine just the header of the packet.

DPI is implemented at the firewall level and is applied to layer 7 traffic. Deep packet inspection uses a combination of pattern matching and protocol anomaly detection -  whereby packets are only allowed through that also fit a specific profile for that given protocol.

The benefits are that requests are more rigorously verified, and handled based on their overall composition rather than the headers alone.

The drawback is that this additional overhead slows traffic down as it passes through DPI as there is a computational cost to packet processing.

##### Remotely Triggered Black Hole Filtering
Remotely triggered black hole filtering [20] is a technique that allows the target of the attack to drop potentially dangerous traffic before it enters an internal network, by blocking all incoming traffic at the edge of the network, 

Essentially RTBH allows a new route to be inserted into the network - which forces the routers to drop traffic with a predetermined next destination (hop), a black hole.

The benefits of this mitigation is that one configured this can be enabled (remotely triggered) and all incoming traffic will be cast aside, the downside is - the DDoS attack itself has achieved its goal - and the resources are no longer, at least externally, available.

#### Victims and Targets
As reported by wired [21], covering the trial of the hackers who first developed Mirai, and applied it in DDoS attacks, the most high profile being the attack on Krebs on Security, the actors themselves were found to be college students in the US, who were originally targeting Minecraft servers in an attempt to gain a financial advantage. 

Bill Walton, the FBI special agent leading the case was quoted as saying “They didn’t realize the power they were unleashing, this was the Manhattan project.”, and continued, “They just got greedy—they thought, ‘If we can knock off our competitors, we can corner the market on both servers and mitigation.”

By open sourcing Mirai the authors set off a chain of events that led to both the Dyn attack weeks after, and triggered a botnet arms race with IoT devices.

#### Variants of Mirai
Since the release of Mirai source code in 2016 there have been upwards of 60 variants that have extended the original capabilities of Mirai - commonly looking to both extend the range of the botnet, by extending the amount of devices that can be infected and exploited, and leverage the botnet for multiple purposes - not just DDoS attacks.

### Satori

#### Overview
Satori is a variant of Mirai that is based on the original code from Mirai. Coming to prevalence in 2018, it was cited as being a “fast evolving botnet” [22] in that it has exhibited great agility in adapting to survive.

Unlike Mirai that uses telnet ports and brute force to attempt to access the device, and compromise it, Satori evolves this functionality by also testing other vulnerabilities and exploits [8].

With the publicly released source code appearing on pastebin in 2018, TrendMicro found found that the two additional exploits that were added were:
- CVE-2017-17215 - A vulnerability in the Huawei Home Gateway routers - originally patched in 2017 a large number of devices at this point hadn’t been patched. Satori attacks these devices on port 37215
- CVE-2014-8361 - A command injection (injecting malicious shell commands into the OS) vulnerability in Realtek SDK miniigd Universal Plug and Play (UPnP) SOAP interface, targeting port 52869.

#### Evolving Threat
As Mcafee mentioned the Satori botnet is a very agile, and adapting botnet, where the authors are constantly playing cat and mouse with security researchers. 

In January 2018 an evolution of Satori, Satori.Coin.Robber, was found to be exploiting a weakness in the “Claymore Miner” [23]. This variant looks to exploit a vulnerability by attacking the management port (3333) that the Claymore Miner uses  for management purposes, and attempts to inject the attackers IP for the wallet - whereby the attacker could then cash out their cryptocurrency, in this case Etherium.

It was found that this additional vulnerability had been added alongside the two original Satori exploits (as mentioned in the overview). Interestingly this version of Satori didn’t look to perform a DDoS - but instead leaned further into the worm capabilities of Mirai.

Another variant detected by radware in 2018 [24] introduced an exploit that targeted CVE-2017-18046, a vulnerability in Datan GPON ONT WiFi router - looking to exploit a “Buffer Overflow” error that allows attackers to execute code (RCE) through malformed HTTP POST requests. 

As reported by Unit 42 researchers in February 2021 [25] an attempt to exploit a remote code execution vulnerability (CVE-2020-9020) in a IoT vehicle device (Iteris’ Vantage Velocity field unit) was found to have originated from Satori based on the behaviours and patterns of the attempts to exploit this vulnerability - scanning a set of ports and attempting to brute force with the dictionary attempt.

So where Mirai itself hasn’t changed, Satori appears to have been a step forward for attackers in that it allows for exploits to be used alongside brute forcing these telnet ports, and the attackers developing Satori have learnt to be agile in their approach - adapting the botnet as newer vulnerabilities emerge. 

#### Victims and Targets
The victims and targets of Satori and it’s evolutions continue to be wide, and similar to Mirai, for financial advantage, especially when considering Satori.Coin.Robber. Unlike Mirai though, the attackers are now vastly more aware of the impact that attacks of this kind have both on the target, and - potentially - the internet infrastructure as a whole. It seems as well that Satori is being leveraged as a botnet for other applications beyond just DDoS attacks.

### SMMR1
#### Overview
In 2019 Trend Micro reported a new variant of Mirai botnet (Trojan.Linux.MIRAI.SMMR1) [26] that similar to Satori introduces multiple exploits alongside brute force attacks on the telnet port. Where Satori began life with 2 additional exploits - SMMR was shown to have 7 different exploits.

The detected exploits were, as documented by TrendMicro:
- CVE-2014-8361 - A command injection (injecting malicious shell commands into the OS) vulnerability in Realtek SDK miniigd Universal Plug and Play (UPnP) SOAP interface, targeting port 52869.
- CVE-2017-17215 - A vulnerability in the Huawei Home Gateway routers - originally patched in 2017 a large number of devices at this point hadn’t been patched. Satori attacks these devices on port 37215
- Exploit for CVE-2013-4863 and CVE-2016-6255, remote code execution (RCE) vulnerabilities in MiCasaVerde Veralite targeting smart home controllers. 
- A privilege escalation exploit in the ZyXEL P660HN-T v1 router.
- Authentication bypass (CVE-2018-10561) and command injection (CVE-2018-10562) vulnerabilities in Dasan’s gigabit-capable passive optical network (GPON) home routers.
- A remote code execution (RCE) flaw in Linksys E-Series routers that was also exploited by TheMoon, one of the earliest IoT botnet malware.
- An RCE exploit for the ThinkPHP 5.0.23/5.1.31, an open-source web development framework. Trend Micro researchers also observed the Hakai and Yowai botnet malware exploiting the flaw to breach web servers.

This variant of Mirai also appears to introduce an extended list of credentials used in the brute force dictionary attacks that aren’t found in the original Mirai, nor in Satori. 

#### Evolving Threat
The step forward here from the previous years Satori variant is the increase in the amount of exploits being used by the botnet to gain privileged access to the devices, as well as increasing the dictionary size used in the attack. 

The exploits don’t appear to be targeting a specific family of devices, which when you consider the makeup of an IoT botnet makes sense - the more devices, and therefore larger generalization, the greater the impact. 

Interestingly the exploits range from those within the last year since this variant was developed, all the way back to CVEs from 2013. Seemingly the older the IoT device the more vulnerable it is to attack. 

#### Victims and Targets
This has been discovered in a honey pot used to detect potential IoT threats (acting as bait) - so is definitely proliferating across the internet - however there aren’t any specific attack reports, or post mortems that highlight this as the attack vector. 

### Katana
#### Overview
In 2020 Avira’s research team identified a new variant of Mirai dubbed Katana [10]. Katana, similar to Mirai and the variants Satori and SMMR 1 contains both the dictionary attack mechanic as well a number of old exploits for remote code execution, or code injection.

With Mirai and the other variants, the way the exploits are deployed - if the device is reset then it is no longer infected (unless it gets reinfected). Katana tries to mitigate this as much as possible by modifying watchdog. Watchdog (https://linuxhint.com/linux-kernel-watchdog-explained/) is a daemon that runs on linux systems, and performs monitoring - if the system hangs and becomes unresponsive due to a fatal software error, watchdog restarts the system. This daemon is commonly found on IoT devices where restarting has to be an automated process, unlike devices with direct interaction such as mobiles, laptops, or desktops. By modifying this - katana is looking to preserve itself as much as possible.

#### Evolving Threat
This evolution, contrasted with previous variants, looks to maintain access by preventing IoT devices rebooting - as opposed to introducing new vulnerabilities for accessing IoT devices.

### ZHTrap
#### Overview
In 2021 Unit42 [6] discovered a new variant of Mirai that looks similar to Satori leveraging an extended set of vulnerabilities to access and exploit devices. Where ZHTrap differentiates itself is in that it looks to “deploy honeypots that capture attacks from rival botnets to hijack their infrastructure” [27].

Honeypots act as a trap to lure attackers, both automated, and manual, to attack an intentionally compromised system. Often these are used by security researchers to analyse attack patterns, and the vulnerabilities exploited to determine the best remediation steps.

In the case of ZHTrap it looks to turn the infected device itself into a honeypot, luring in other botnets, to gain access to their list of IP addresses - and therefore more potentially vulnerable targets - extending its reach.

Heimdel Security [28] noted that ZHTrap infected devices open a honeypot on port 23, and send any IPs connecting to that port back to the replication module that handles scanning and identifying new devices.

#### Evolving Threat
This evolution looks to extend the reach of the botnet, by not just attacking vulnerable targets, but competing botnets. From a social side this also re-enforces that hackers are often looking to get the upper hand on each other, as well as their intended targets.

### Conclusion 
Since hitting the headlines in 2016 Mirai has continued to evolve through it’s descendents and variants since the release of the underlying source code. 

In framing the evolution consider the 5 steps of hacking a target:
- Reconnaissance - gathering information about the target, or identifying a potential target
- Scanning - determining the access points for the target, and clarifying as many unknowns as possible
- Gaining access - Exploiting a vulnerability on the device, or performing a credentials attack to gain access
- Maintaining access - Ensuring the attacker can continually access the target
- Covering tracks - Post attack clean up 

The original Mirai performed reconnaissance using ranges of IP addresses to determine potential targets, scanned these devices to see if the target ports were available, looked to gain access by leveraging a dictionary attack against the device, and looked to maintain access by removing any other exploits that competing botnets / malware might look to leverage.

The subsequent variants looked to increase the capabilities at steps 1, 2, 3, and 4 of this process. Satori, and SMMR 1 by leveraging additional vulnerabilities improved the scanning and access steps by providing additional attack vectors. Katana looks to increase the ability to maintain access, by preventing devices from automatically rebooting when encountering an error, and ZHTrap looks to increase the reconnaissance by luring and commandeering competing botnets.

In conclusion the release, and open sourcing of Mirai has led to an increased evolution speed, and an ever evolving threat. Evolution has looked to increase the capabilities at each step of the hacking process, from an increased scope of attack, to leveraging an ever growing list of vulnerabilities, and more recently looking to maintain access.  

Mirai and it’s descendents will continue to evolve, and it’s up to security researchers to continue to identify these variants, and for device OEMs to continually increase the security and patch vulnerabilities as soon as possible.

### Bibliography
- [1] “MMD-0056-2016 - Linux/Mirai, how an old ELF malcode is recycled..,” Malware Must Die!, 01-Sep-2016. [Online]. Available: https://blog.malwaremustdie.org/2016/08/mmd-0056-2016-linuxmirai-just.html. [Accessed: 04-Apr-2021]. A blog post from Malware Must Die discussing the discovery of Mirai
- [2] B. Kerbs, “Source Code for IoT Botnet 'Mirai' Released,” Krebs on Security, 01-Oct-2016. [Online]. Available: https://krebsonsecurity.com/2016/10/source-code-for-iot-botnet-mirai-released/. [Accessed: 04-Apr-2021]. A blog post from Brian Kerbs discussing the release of the Mirai source code
- [3] D. Bisson, “100,000 Bots Infected with Mirai Malware Behind Dyn DDoS Attack,” The State of Security, 27-Oct-2016. [Online]. Available: https://www.tripwire.com/state-of-security/latest-security-news/100000-bots-infected-mirai-malware-caused-dyn-ddos-attack/. [Accessed: 04-Apr-2021]. A blog post from State of Security discussing the scale of the DYN attack
- [4] “DDoS attack that disrupted internet was largest of its kind in history, experts say,” The Guardian, 26-Oct-2016. [Online]. Available: https://www.theguardian.com/technology/2016/oct/26/ddos-attack-dyn-mirai-botnet. [Accessed: 04-Apr-2021]. Article from UK national press discussing the DYN attack
- [5] T. Seals, “Mirai Botnet Sees Big 2019 Growth, Shifts Focus to Enterprises,” Threatpost English Global threatpostcom, 19-Jul-2019. [Online]. Available: https://threatpost.com/mirai-botnet-sees-big-2019-growth-shifts-focus-to-enterprises/146547/. [Accessed: 04-Apr-2021]. A blog post from Threat Post discussing the shift in Mirai attacks
- [6] V. Singhal, R. Nigam, Z. Zhang, and A. Davila, “Mirai Variant Targeting New IoT Vulnerabilities, Network Security Devices,” Unit42, 16-Mar-2021. [Online]. Available: https://unit42.paloaltonetworks.com/mirai-variant-iot-vulnerabilities. [Accessed: 04-Apr-2021]. Paper discussing the new ZHTrap variant of Mirai
- [7] M. Mimoso, “IoT Botnets Are The New Normal of DDoS Attacks,” Threatpost English Global threatpostcom, 05-Oct-2016. [Online]. Available: https://threatpost.com/iot-botnets-are-the-new-normal-of-ddos-attacks/121093. [Accessed: 04-Apr-2021]. A blog post from Threat Post discussing the rise of botnet attacks
- [8] “Source Code of IoT Botnet Satori Publicly Released on Pastebin,” Source Code of IoT Botnet Satori Publicly Released on Pastebin - Security News, 03-Jul-2018. [Online]. Available: https://www.trendmicro.com/vinfo/ph/security/news/internet-of-things/source-code-of-iot-botnet-satori-publicly-released-on-pastebin. [Accessed: 05-Apr-2021]. Trend micro news article discussing the release of the Satori source code
- [9] “Mirai Variant Spotted Using Multiple Exploits, Targets Various Routers,” Security News, 04-Apr-2019. [Online]. Available: https://www.trendmicro.com/vinfo/us/security/news/internet-of-things/mirai-variant-spotted-using-multiple-exploits-targets-various-routers. [Accessed: 05-Apr-2021]. Trend micro news article discussing the SMMR1 variant of Mirai
- [10] A. P. Labs, “Katana: a new variant of the Mirai botnet,” Avira Blog, 16-Mar-2021. [Online]. Available: https://www.avira.com/en/blog/katana-a-new-variant-of-the-mirai-botnet. [Accessed: 05-Apr-2021]. Avira news article discussing the Katana variant of Mirai
- [11] B. Herzberg and D. Bekermah, “Breaking Down Mirai: An IoT DDoS Botnet Analysis,” Blog, 06-Oct-2019. [Online]. Available: https://www.imperva.com/blog/malware-analysis-mirai-ddos-botnet/. [Accessed: 05-Apr-2021]. A breakdown analysis of Mirai
- [12] “What is SYN scanning? - Definition from WhatIs.com,” SearchNetworking, 16-Apr-2007. [Online]. Available: https://searchnetworking.techtarget.com/definition/SYN-scanning. [Accessed: 06-Apr-2021]. Definition of SYN scanning
- [13] “Inside the infamous Mirai IoT Botnet: A Retrospective Analysis,” The Cloudflare Blog, 21-Aug-2020. [Online]. Available: https://blog.cloudflare.com/inside-mirai-the-infamous-iot-botnet-a-retrospective-analysis/. [Accessed: 06-Apr-2021]. Mirai retrospective analysis
- [14] M. Antonkakis, T. April, M. Bailey, M. Bernhard, E. Bursztein, J. Cochran, Z. Durumeric, J. A. Halderman, L. Invernizzi, M. Kallitsis, D. Kumar, C. Lever, Z. Ma, J. Mason, D. Menscher, C. Seaman, N. Sullivan, K. Thomas, and Y. Zhou, “Understanding the Mirai Botnet,” 26th USENIX Security Symposium, Aug. 2017. [Online]. Available: https://www.usenix.org/system/files/conference/usenixsecurity17/sec17-antonakakis.pdf [Accessed: 06-Apr-2021] A published paper discussing the inner workings of Mirai
- [15] S. Hiilton, “Dyn Analysis Summary Of Friday October 21 Attack: Dyn Blog,” Dyn Dyn Analysis Summary Of Friday October 21 Attack Comments, 26-Oct-2016. [Online]. Available: https://web.archive.org/web/20170602091422/http://dyn.com/blog/dyn-analysis-summary-of-friday-october-21-attack. [Accessed: 07-Apr-2021]. Archived (web archive) blog from DYN discussing the 2016 attack
- [16] N. Torga, “How to Improve Website Resilience for DDoS Attacks – Part II – Caching,” Sucuri Blog, 28-Nov-2018. [Online]. Available: https://blog.sucuri.net/2018/08/how-to-improve-website-resilience-for-ddos-attacks-caching.html. [Accessed: 07-Apr-2021]. Article discussing DDos defence techniques
- [17] “The Akamai Blog Subscribe,” Memcached UDP Reflection Attacks - The Akamai Blog, 27-Feb-2018. [Online]. Available: https://blogs.akamai.com/2018/02/memcached-udp-reflection-attacks.html. [Accessed: 08-Apr-2021]. Blog post covering the Memcached Reflection attack
- [18] Smart Mode: DDoS Attack Detection using Machine Learning, 28-Aug-2020. [Online]. Available: https://blog.nexusguard.com/smart-mode-ddos-attack-detection-using-machine-learning. [Accessed: 08-Apr-2021]. Discussion of using ML techniques to detect DDos attacks
- [19] “What is Deep Packet Inspection? How It Works, Use Cases for DPI, and More,” Digital Guardian, 05-Dec-2018. [Online]. Available: https://digitalguardian.com/blog/what-deep-packet-inspection-how-it-works-use-cases-dpi-and-more. [Accessed: 08-Apr-2021]. Blog post covering the concept of DPI
- [20] “Remotely Triggered Black Hole Filtering,” Cisco, 2005. [Online]. Available: https://www.cisco.com/c/dam/en_us/about/security/intelligence/blackhole.pdf. [Accessed: 08-Apr-2021]. Cisco published white paper discussing RTBHF
- [21] G. M. Graff, “The Mirai Botnet Was Part of a College Student Minecraft Scheme,” Wired, 13-Dec-2017. [Online]. Available: https://www.wired.com/story/mirai-botnet-minecraft-scam-brought-down-the-internet/. [Accessed: 09-Apr-2021]. News article published by Wired
- [22] C. Beek, “Satori Botnet Turns IoT Devices Into Zombies By Borrowing Code from Mirai,” McAfee Blogs, 09-Feb-2018. [Online]. Available: https://www.mcafee.com/blogs/enterprise/satori-botnet-turns-iot-devices-zombies-borrowing-code-mirai/. [Accessed: 10-Apr-2021]. Blog post from Mcafee discussing Satori- [23] “Art of Steal: Satori Variant is Robbing ETH BitCoin by Replacing Wallet Address,” 360 Netlab Blog - Network Security Research Lab at 360, 06-Oct-2018. [Online]. Available: https://blog.netlab.360.com/art-of-steal-satori-variant-is-robbing-eth-bitcoin-by-replacing-wallet-address-en/. [Accessed: 09-Apr-2021]. Netlab article discussing Satori application (cryptocurrency attack)
- [24] “New Satori Botnet Variant Enslaves Thousands of Dasan WiFi Routers,” Radware Blog, 13-Feb-2018. [Online]. Available: https://blog.radware.com/security/botnets/2018/02/new-satori-botnet-variant-enslaves-thousands-dasan-wifi-routers/. [Accessed: 09-Apr-2021]. Raware article discussing Satori variant
- [25] H. Zhang, V. Singhal, Z. Zhang, and J. Du, “Satori: Mirai Botnet Variant Targeting Vantage Velocity Field Unit RCE Vulnerability,” Unit42, 22-Mar-2021. [Online]. Available: https://unit42.paloaltonetworks.com/satori-mirai-botnet-variant-targeting-vantage-velocity-field-unit-rce-vulnerability/. [Accessed: 10-Apr-2021]. Unit42 discovery of new Satori variant targeting vehicle IoT device
- [26] “Mirai Variant Spotted Using Multiple Exploits, Targets Various Routers,” Mirai Variant Spotted Using Multiple Exploits, Targets Various Routers - Wiadomości bezpieczeństwa, 04-Feb-2019. [Online]. Available: https://www.trendmicro.com/vinfo/pl/security/news/internet-of-things/mirai-variant-spotted-using-multiple-exploits-targets-various-routers. [Accessed: 11-Apr-2021]. Article discussing discovery of SMMR1 variant
- [27] “ZHtrap Botnet: Hackers Pitting Against Each Other: Cyware Hacker News,” Cyware Labs, 23-Mar-2021. [Online]. Available: https://cyware.com/news/zhtrap-botnet-hackers-pitting-against-each-other-7c6924cb. [Accessed: 12-Apr-2021]. Article discussing the ZHTrap variant
- [28] D. Tudor, “ZHtrap Botnet Malware Deploys Honeypots in the Search for More Targets,” Heimdal Security Blog, 15-Mar-2021. [Online]. Available: https://heimdalsecurity.com/blog/zhtrap-botnet-deploys-honeypots/. [Accessed: 12-Apr-2021]. ZHTrap article covering honeypot