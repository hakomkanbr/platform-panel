"use client";

import React, { useEffect, useTransition } from "react";
import styles from "./FullScreenLoader.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/redux-toolkit/store";
import { usePathname } from "next/navigation";
import { setLoading } from "@/lib/redux-toolkit/slice/ui-slice";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiShoppingBag3Fill,
  RiStore2Line,
  RiArticleLine,
  RiBarChartBoxLine,
  RiBox3Line,
  RiTeamLine,
  RiApps2Line,
  RiSparklingFill,
} from "react-icons/ri";

interface Props {
  tip?: string;
}

// Satellite Apps orbiting/emerging from the shopping cart hub
const SATELLITE_APPS = [
  {
    id: "ecommerce",
    title: "E-Commerce",
    icon: RiStore2Line,
    className: styles.ecommerceApp,
    angle: -90, // Top
    distance: 98,
    delay: 0.1,
  },
  {
    id: "cms",
    title: "CMS & Content",
    icon: RiArticleLine,
    className: styles.cmsApp,
    angle: -30, // Top Right
    distance: 98,
    delay: 0.2,
  },
  {
    id: "analytics",
    title: "Analytics",
    icon: RiBarChartBoxLine,
    className: styles.analyticsApp,
    angle: 30, // Bottom Right
    distance: 98,
    delay: 0.3,
  },
  {
    id: "inventory",
    title: "Products & Stock",
    icon: RiBox3Line,
    className: styles.inventoryApp,
    angle: 90, // Bottom
    distance: 98,
    delay: 0.4,
  },
  {
    id: "users",
    title: "CRM & Customers",
    icon: RiTeamLine,
    className: styles.usersApp,
    angle: 150, // Bottom Left
    distance: 98,
    delay: 0.5,
  },
  {
    id: "apps",
    title: "Apps & Integrations",
    icon: RiApps2Line,
    className: styles.settingsApp,
    angle: 210, // Top Left
    distance: 98,
    delay: 0.6,
  },
];

const FullScreenLoader: React.FC<Props> = ({ tip = "جاري تحميل المنصة..." }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const loading = useSelector((state: RootState) => state.ui.loading);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    dispatch(setLoading(true));
    startTransition(() => {
      dispatch(setLoading(false));
    });
  }, [pathname, dispatch]);

  const isVisible = loading || isPending;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles.loaderOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          {/* Ambient Glow */}
          <div className={styles.ambientGlow} />

          {/* Animation Stage */}
          <div className={styles.stage}>
            {/* Pulsing Radar Ripple Waves */}
            <div className={styles.ripple} />
            <div className={styles.ripple} />
            <div className={styles.ripple} />

            {/* Subtle Orbit Rings */}
            <div className={styles.orbitRing} />
            <div className={styles.orbitRingSecondary} />

            {/* Central Shopping Basket Hub */}
            <motion.div
              className={styles.basketHub}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 18,
                duration: 0.6,
              }}
            >
              <div className={styles.basketIconWrapper}>
                <RiShoppingBag3Fill />
              </div>
              <div className={styles.sparkleBadge}>
                <RiSparklingFill />
              </div>
            </motion.div>

            {/* Satellite Apps popping out from inside the basket */}
            {SATELLITE_APPS.map((app, index) => {
              const rad = (app.angle * Math.PI) / 180;
              const targetX = Math.cos(rad) * app.distance;
              const targetY = Math.sin(rad) * app.distance;

              const Icon = app.icon;

              return (
                <motion.div
                  key={app.id}
                  className={styles.satelliteApp}
                  initial={{
                    x: 0,
                    y: 0,
                    scale: 0,
                    opacity: 0,
                  }}
                  animate={{
                    x: [0, targetX * 1.12, targetX],
                    y: [0, targetY * 1.12, targetY],
                    scale: [0, 1.15, 1],
                    opacity: [0, 1, 1],
                  }}
                  transition={{
                    delay: 0.25 + app.delay,
                    duration: 0.7,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  title={app.title}
                >
                  <motion.div
                    className={`${styles.appBubble} ${app.className}`}
                    animate={{
                      y: [0, index % 2 === 0 ? -4 : 4, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.2 + (index % 3) * 0.4,
                      ease: "easeInOut",
                      delay: app.delay,
                    }}
                  >
                    <Icon />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Info and Status Section */}
          <motion.div
            className={styles.infoContainer}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className={styles.brandPill}>
              <span className={styles.brandDot} />
              <span>Share2Sells Hub</span>
            </div>

            <h3 className={styles.loaderTitle}>{tip}</h3>

            <div className={styles.progressBarTrack}>
              <div className={styles.progressBarFill} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullScreenLoader;

