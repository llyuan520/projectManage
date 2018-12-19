import Link from 'umi/link';
import styles from './index.css';

export default function() {
  return (
    <div className={styles.normal}>
      <div className={styles.welcome} />
      <ul className={styles.list}>
        <li><Link to="./project">项目信息</Link></li>
        <li><Link to="./addStaging">添加分期</Link></li>
      </ul>
    </div>
  );
}
