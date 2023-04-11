import AMM from '../components/layout/amm.layout';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Head from 'next/head';
import type { NextPage } from 'next';
import { ethers } from 'ethers';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {

  return (
    <div className={styles.container}>
      <Head>
        <title>Swipe</title>
        <meta
          content="Liquidity in your hand, one stop for all tokens"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        <h1 className={styles.title}>
          Welcome to <a href="">SWIPE</a>
        </h1>

        <p className={styles.description}>
          An AMM which has liquidity all the time
        </p>

        <AMM />
      </main>

      <footer className={styles.footer}>
        <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
          Made with ❤️ by your frens at Coin<span className='text-red-600 font-semibold'>DCX</span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
