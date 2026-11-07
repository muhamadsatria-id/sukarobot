// import AboutSection from './AboutSection'
import AreaSection from './AreaSection'
import ArmadaSection from './ArmadaSection'
import CaraSewaSection from './CaraSewaSection'
import FaqSection from './FaqSection'
import HeroSection from './HeroSection'
import Paralaks from './Paralaks'
import TestimonialSection from './TestimonialSection'

export default function HomeSections({ ctx }) {
  const {
    store,
    loading,
    products,
    routes,
    testimonials,
    rentalMode,
    currency,
    setOrderProduct,
    storeWhatsApp,
    startingPrice,
    readyCount,
    onViewAll,
  } = ctx

  return (
    <>
      <HeroSection
        store={store}
        loading={loading}
        storeWhatsApp={storeWhatsApp}
        startingPrice={startingPrice}
        readyCount={readyCount}
      />
      <Paralaks />
      {/* <AboutSection store={store} /> */}
      <ArmadaSection
        loading={loading}
        products={products}
        currency={currency}
        rentalMode={rentalMode}
        setOrderProduct={setOrderProduct}
        onViewAll={onViewAll}
      />
      <CaraSewaSection storeWhatsApp={storeWhatsApp} />
      <AreaSection store={store} routes={routes} />
      <FaqSection storeWhatsApp={storeWhatsApp} />
      <TestimonialSection testimonials={testimonials} loading={loading} />
    </>
  )
}
