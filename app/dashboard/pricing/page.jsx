import Pricing from "../../ui/dashboard/pricing/pricing";
import styles from "../../ui/dashboard/pricing/pricing.module.css"

const PricingPage = () => {

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Pricing />
      </div>
    </div>
  )
}

export default PricingPage;