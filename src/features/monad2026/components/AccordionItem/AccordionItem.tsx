// FAQ 아코디언 아이템 컴포넌트입니다.
import { memo } from 'react'
import styles from './AccordionItem.module.css'

interface AccordionItemProps {
  id: string
  question: string
  answer: string
  isOpen: boolean
  onToggle: (id: string) => void
}

export const AccordionItem = memo(function AccordionItem({
  id,
  question,
  answer,
  isOpen,
  onToggle,
}: AccordionItemProps) {
  return (
    <article className={`${styles.item} ${isOpen ? styles.open : ''}`}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => onToggle(id)}
        aria-expanded={isOpen}
      >
        <span className={styles.question}>{question}</span>
        <span className={styles.icon}>+</span>
      </button>
      <div className={styles.answerWrap}>
        <div className={styles.answerInner}>
          <p className={styles.answer}>{answer}</p>
        </div>
      </div>
    </article>
  )
})
