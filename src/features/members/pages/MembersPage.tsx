// Members 페이지 루트입니다.
import { memo, useMemo, useState } from 'react'
import { HeroMemberStrip } from '../components/HeroMemberStrip/HeroMemberStrip'
import { MemberCarousel } from '../components/MemberCarousel/MemberCarousel'
import { MemberDetailSection } from '../components/MemberDetailSection/MemberDetailSection'
import { MembersRepository } from '../data/members'
import styles from './MembersPage.module.css'

export const MembersPage = memo(function MembersPage() {
  const [selectedYear, setSelectedYear] = useState<number>(
    MembersRepository.getDefaultYear(),
  )

  const yearGroup = useMemo(() => {
    return (
      MembersRepository.getYearGroupByYear(selectedYear) ??
      MembersRepository.getDefaultYearGroup()
    )
  }, [selectedYear])

  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    yearGroup.members[0]?.id ?? '',
  )

  const selectedMember =
    yearGroup.members.find((member) => member.id === selectedMemberId) ??
    yearGroup.members[0]

  const selectedMemberIndex = yearGroup.members.findIndex(
    (member) => member.id === selectedMember.id,
  )

  const handlePrevMember = () => {
    if (yearGroup.members.length === 0) {
      return
    }

    const nextIndex =
      selectedMemberIndex <= 0
        ? yearGroup.members.length - 1
        : selectedMemberIndex - 1

    setSelectedMemberId(yearGroup.members[nextIndex].id)
  }

  const handleNextMember = () => {
    if (yearGroup.members.length === 0) {
      return
    }

    const nextIndex = (selectedMemberIndex + 1) % yearGroup.members.length
    setSelectedMemberId(yearGroup.members[nextIndex].id)
  }

  const handleSelectMember = (memberId: string) => {
    setSelectedMemberId(memberId)
  }


  if (!selectedMember) {
    return null
  }

  const handleChangeYear = (year: number) => {
    if (year === selectedYear) {
      return
    }

    const nextGroup =
      MembersRepository.getYearGroupByYear(year) ?? MembersRepository.getDefaultYearGroup()

    setSelectedYear(year)
    setSelectedMemberId(nextGroup.members[0]?.id ?? '')
  }

  return (
    <article className={styles.page}>
      <HeroMemberStrip yearGroup={yearGroup} />

      <section className={styles.yearHeadingSection}>
        <h2>{yearGroup.title}</h2>
        <p>{yearGroup.generationLabel}</p>
      </section>

      <MemberDetailSection key={selectedMember.id} member={selectedMember} />

      <MemberCarousel
        members={yearGroup.members}
        selectedMemberId={selectedMember.id}
        yearLabel={yearGroup.title}
        onSelectMember={handleSelectMember}
        onPrevMember={handlePrevMember}
        onNextMember={handleNextMember}
      />

      <section className={styles.yearSelectorSection}>
        {MembersRepository.getYearOrder().map((year) => (
          <button
            key={year}
            type="button"
            className={`${styles.yearButton} ${year === selectedYear ? styles.yearButtonActive : ''}`}
            onClick={() => handleChangeYear(year)}
          >
            {year}
          </button>
        ))}
      </section>
    </article>
  )
})
