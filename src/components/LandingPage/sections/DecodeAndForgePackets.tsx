import React from 'react';
import Body from '../components/Body';
import styles from '../components/Styles';
import TwoColumns from '../components/TwoColumns';
import TextColumn from '../components/TextColumn';
import Button from '../components/Button';
import CodeBlock from '@theme/CodeBlock';


const DecodeAndForgePackets = (): JSX.Element  => {

    return (
        <Body className={styles.NativeApps} background="light">
        <TwoColumns
            columnOne={
            <TextColumn
                title="Decode and forge packets"
                content={
                <>
                    <p>
                    PcapPlusPlus enables decoding and forging capabilities for a large variety of <a href="/docs/features#supported-network-protocols">network protocols</a>
                    </p>
                    <Button text="Learn More" to="/docs/features#packet-parsing-and-crafting"/>
                </>
                }
            />
            }
            columnTwo={
            <CodeBlock className="language-cpp">
                {
    `// parse the raw packet into a parsed packet
    pcpp::Packet parsedPacket(&rawPacket);

    // check if it's an IPv4 packet
    if (parsedPacket.isPacketOfType(pcpp::IPv4)) {
    // extract source and dest IPs
    pcpp::IPv4Address srcIP = 
        parsedPacket.getLayerOfType()->getSrcIPv4Address();
    pcpp::IPv4Address destIP = 
        parsedPacket.getLayerOfType()->getDstIPv4Address();

    // print source and dest IPs
    std::cout << 
        "Source IP is: " << srcIP << std::endl <<
        "Dest IP is: " << destIP << std::endl;`
                }
            </CodeBlock>
            }
        />
        </Body>
    );
};

export default DecodeAndForgePackets;