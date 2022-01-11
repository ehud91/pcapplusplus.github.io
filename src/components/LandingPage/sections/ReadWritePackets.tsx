import React from 'react';
import Body from '../components/Body';
import TwoColumns from '../components/TwoColumns';
import TextColumn from '../components/TextColumn';
import Button from '../components/Button';
import styles from '../components/Styles';
import CodeBlock from '@theme/CodeBlock';


const ReadWritePackets = (): JSX.Element  => {
    return (
      <Body className={styles.NativeApps} background="light">
        <TwoColumns
          columnOne={
            <TextColumn
              title="Read and write packets to files"
              content={
                <>
                  <p>
                    PcapPlusPlus provides an easy-to-use interface for reading and writing network packets into files. It supports the most popular file formats which are <a href="https://wiki.wireshark.org/Development/LibpcapFileFormat">PCAP</a> and <a href="https://github.com/pcapng/pcapng">PCAPNG</a>
                  </p>
                  <Button text="Learn More" to="/docs/features#read-and-write-packets-fromto-files"/>
                </>
              }
            />
          }
          columnTwo={
            <CodeBlock className="language-cpp">
            {
  `// create a pcap file reader
  pcpp::PcapFileReaderDevice pcapReader("input.pcap");
  pcapReader.open();
  
  // create a pcapng file writer
  pcpp::PcapNgFileWriterDevice pcapNgWriter("output.pcapng");
  pcapNgWriter.open();
  
  // raw packet object
  pcpp::RawPacket rawPacket;
  
  // read packets from pcap reader and write pcapng writer
  while (pcapReader->getNextPacket(rawPacket)) {
    pcapNgWriter.writePacket(rawPacket);
  }`
            }
          </CodeBlock>
        }
        />
      </Body>
    );
  };

export default ReadWritePackets;