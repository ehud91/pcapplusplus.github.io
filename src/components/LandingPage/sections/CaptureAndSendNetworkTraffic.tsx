import React, { useState, useEffect } from 'react';
import Body from '../components/Body';
import styles from '../components/Styles';
import TwoColumns from '../components/TwoColumns';
import TextColumn from '../components/TextColumn';
import Button from '../components/Button';
import useBaseUrl from '@docusaurus/useBaseUrl';


const CaptureAndSendNetworkTraffic = (): JSX.Element  => {

    const [showText, setShowText] = useState(true);

    useEffect(() => {
      window.addEventListener('scroll', () => {
          if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {            
              setShowText(false);
          }
      });
    },[]);

    return (
      <Body className={styles.NativeApps + ' capture-and-send-network-traffic'} background="light">
        <TwoColumns
          columnOne={<img alt="" src={useBaseUrl('img/landing-page/capture-engines.png')} />}
          columnTwo={
            <TextColumn
              title="Capture and send network traffic"
              content={
                <>
                  <p>
                    PcapPlusPlus enables capturing and sending network packets through easy-to-use C++ wrappers 
                    for the most popular packet processing engines such as <a href="https://www.tcpdump.org/">libpcap</a>, <a href="https://www.winpcap.org/">WinPcap</a>, <a href="https://nmap.org/npcap/">NPcap</a>, <a href="https://www.dpdk.org/">DPDK</a> and <a href="https://www.ntop.org/products/packet-capture/pf_ring/">PF_RING</a>
                  </p>
                  <Button text="Learn More" to="/docs/features#packet-capture"/>
                </>
              }
            />
          }
          isDisplay={showText}
        />
      </Body>
    );
  };

  export default CaptureAndSendNetworkTraffic;