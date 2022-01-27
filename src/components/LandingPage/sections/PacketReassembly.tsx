import React, { useEffect, useState } from 'react';
import Body from '../components/Body';
import TwoColumns from '../components/TwoColumns';
import TextColumn from '../components/TextColumn';
import Button from '../components/Button';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from '../components/Styles';


const PacketReassembly = (): JSX.Element  => {
    
    const [showText, setShowText] = useState(true);

    useEffect(() => {
      window.addEventListener('scroll', () => {
          if (document.body.scrollTop > 2200 || document.documentElement.scrollTop > 2200) {            
              setShowText(false);
          }
      });
    },[]);

    return (
      <Body className={styles.NativeApps + ' packets-reassembly'} background="light">
        <TwoColumns
          columnOne={<img alt="" src={useBaseUrl('img/landing-page/stream.png')} />}
          columnTwo={
            <TextColumn
              title="Packet reassembly"
              content={
                <>
                  <p>
                    PcapPlusPlus contains unique implementation of packet reassembly techniques.
                  </p>
                  <p>
                    <strong>TCP Reassembly</strong> which supports TCP retransmission, out-of-order TCP packets and missing TCP data.
                  </p>
                  <p>
                    <strong>IP Fragmentation and Defragmentation</strong> to create and reassemble IPv4 and IPv6 fragments
                  </p>
                  <Button text="Learn More" to="/docs/features#packet-reassembly"/>
                </>
              }
            />
          }
          isDisplay={showText}
        />
      </Body>
    );
};


export default PacketReassembly;