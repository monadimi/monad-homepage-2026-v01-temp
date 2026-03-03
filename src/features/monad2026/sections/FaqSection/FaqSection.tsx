// FAQ 아코디언 섹션입니다.
import { memo, useCallback, useState } from 'react'
import { text } from '../../../../content/text/textService'
import { AccordionItem } from '../../components/AccordionItem/AccordionItem'
import styles from './FaqSection.module.css'

interface FaqItemData {
  id: string
  question: string
  answer: string
}

export const FaqSection = memo(function FaqSection() {
  const [openItemId, setOpenItemId] = useState<string | null>(null)
  const faqItems: readonly FaqItemData[] = [
    {
      id: 'faq-1',
      question: text('monad2026', 'faq.item1.question', '지원 자격이 어떻게 되나요?'),
      answer: text(
        'monad2026',
        'faq.item1.answer',
        '모집 공고 기준으로 모나드 활동에 꾸준히 참여할 수 있는 학생이라면 누구나 지원할 수 있습니다.',
      ),
    },
    {
      id: 'faq-2',
      question: text('monad2026', 'faq.item2.question', '지원 기간은 어떻게 되나요?'),
      answer: text(
        'monad2026',
        'faq.item2.answer',
        '지원 폼 오픈 후 마감 기한까지 제출 가능하며, 마감 이후에는 개별 문의를 받고 있습니다.',
      ),
    },
    {
      id: 'faq-3',
      question: text('monad2026', 'faq.item3.question', '개발 경험이 없어도 지원할 수 있나요?'),
      answer: text(
        'monad2026',
        'faq.item3.answer',
        '기초 트랙부터 시작할 수 있어서 경험이 없어도 지원할 수 있습니다.',
      ),
    },
    {
      id: 'faq-4',
      question: text(
        'monad2026',
        'faq.item4.question',
        '창업 동아리와 일반 동아리는 어떤 차이가 있나요?',
      ),
      answer: text(
        'monad2026',
        'faq.item4.answer',
        '창업 동아리는 MVP 실험 중심, 일반 동아리는 기술 역량 중심으로 운영됩니다.',
      ),
    },
    {
      id: 'faq-5',
      question: text('monad2026', 'faq.item5.question', '면접은 어떻게 진행되나요?'),
      answer: text(
        'monad2026',
        'faq.item5.answer',
        '지원서 기반 질의응답으로 진행되며 활동 의지와 협업 태도를 중심으로 확인합니다.',
      ),
    },
  ]
  const title = text('monad2026', 'faq.title', 'FAQ.')

  const handleToggle = useCallback((id: string) => {
    setOpenItemId((previous) => (previous === id ? null : id))
  }, [])

  return (
    <section className={styles.section} aria-label="FAQ">
      <div className={styles.inner}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.list}>
          {faqItems.map((item) => (
            <AccordionItem
              key={item.id}
              id={item.id}
              question={item.question}
              answer={item.answer}
              isOpen={openItemId === item.id}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </section>
  )
})
