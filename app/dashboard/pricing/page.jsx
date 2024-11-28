import Pricing from "@/app/ui/dashboard/pricing/pricing";
import styles from "@/app/ui/dashboard/pricing/pricing.module.css"

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