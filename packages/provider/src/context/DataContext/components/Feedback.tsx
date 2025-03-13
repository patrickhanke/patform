import { AnimatePresence, motion } from 'motion/react'
import '../styles.scss'
import { Response } from '@repo/types'

const Feedback = ({ feedback }: {feedback: Response | null}) => {
  const isPositive = feedback && feedback?.success === true ? true : false

  return (
    <AnimatePresence initial={false}>
        {feedback &&
            <motion.div
                className={`feedback_container ${isPositive ? 'positive' : 'negative'}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
            >
                {feedback.message}
            </motion.div>
        }
    </AnimatePresence>
  )
}

export default Feedback
