import styles from './styles.module.scss'
import {VscGithubInverted } from 'react-icons/vsc'
import { AuthContext } from '../../contexts/Auth';
import { useContext } from 'react';

export function LoginBox() {
  const {signInUrl, user} = useContext(AuthContext)
  
  return (
    <div className={styles.loginBoxWrapper}>
      <strong>Envie e compartilhe sua mensagem</strong>
      <a href={signInUrl} className={styles.signInWithGithub}>
        <VscGithubInverted size="24" />
        Entrar com Github
      </a>
    </div>
  );
  
}