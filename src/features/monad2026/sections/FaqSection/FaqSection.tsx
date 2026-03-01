// FAQ 아코디언 섹션입니다.
import { memo, useCallback, useState } from 'react'
import { SectionTitle } from '../../components/SectionTitle/SectionTitle'
import { AccordionItem } from '../../components/AccordionItem/AccordionItem'
import styles from './FaqSection.module.css'

interface FaqItemData {
  id: string
  question: string
  answer: string
}

const faqItems: readonly FaqItemData[] = [
  {
    id: 'faq-1',
    question: '지원은 언제까지 가능한가요?',
    answer: '모집 마감 전까지 지원서 제출이 가능합니다. 상세 일정은 공지에서 확인할 수 있습니다.',
  },
  {
    id: 'faq-2',
    question: '개발 경험이 없어도 지원할 수 있나요?',
    answer: '기초 학습 트랙이 함께 운영되므로 경험이 없어도 지원할 수 있습니다.',
  },
  {
    id: 'faq-3',
    question: '어떤 활동이 중심인가요?',
    answer: '프로젝트, 기술 스터디, 발표 세션이 핵심 활동입니다.',
  },
  {
    id: 'faq-4',
    question: '창업 동아리와 일반 동아리의 차이는 무엇인가요?',
    answer: '창업 동아리는 문제 탐색과 MVP 실험, 일반 동아리는 개발 역량 강화 중심으로 운영됩니다.',
  },
  {
    id: 'faq-5',
    question: '면접은 어떻게 진행되나요?',
    answer: '기본 질문과 활동 의지를 중심으로 간단한 인터뷰가 진행됩니다.',
  },
]

export const FaqSection = memo(function FaqSection() {
  const [openItemId, setOpenItemId] = useState<string | null>(null)

  const handleToggle = useCallback((id: string) => {
    setOpenItemId((previous) => (previous === id ? null : id))
  }, [])

  return (
    <section className={styles.section} aria-label="FAQ">
      <SectionTitle text="FAQ." />
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
    </section>
  )
})
