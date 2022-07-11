import React from 'react'
import { BsBookHalf, BsBoundingBox, BsColumnsGap, BsCreditCard2FrontFill, BsFillArchiveFill, BsFillAwardFill, BsFillBarChartLineFill, BsFillBookFill, BsFillBookmarksFill, BsFillBriefcaseFill, BsFillCalendarDateFill, BsFillCalendarEventFill, BsFillCalendarWeekFill, BsFillCameraFill, BsFillChatLeftDotsFill, BsFillDiagram3Fill, BsFillDiamondFill, BsFillEnvelopeFill, BsFillEnvelopeOpenFill, BsFillExclamationDiamondFill, BsFillFileEarmarkPlayFill, BsFillFileEarmarkTextFill, BsFillFlagFill, BsFillFolderFill, BsFillFolderSymlinkFill, BsFillGearFill, BsFillGrid1X2Fill, BsFillGridFill, BsFillHouseFill, BsFillImageFill, BsFillInboxesFill, BsFillInfoCircleFill, BsFillInfoSquareFill, BsFillJournalBookmarkFill, BsFillKeyFill, BsFillLayersFill, BsFillPatchCheckFill, BsFillPatchQuestionFill, BsFillPeopleFill, BsFillPersonFill, BsFillPersonLinesFill, BsFillPinAngleFill, BsFillPinFill, BsFillPuzzleFill, BsFillShareFill, BsFillSignpostSplitFill, BsFillStickiesFill, BsFillTagsFill, BsMailbox2, BsMapFill, BsStackOverflow, BsSymmetryHorizontal, BsUiChecks, BsUiChecksGrid } from 'react-icons/bs'

interface IIcon {
    code: number
}

export const ICONS = [
    <BsFillGearFill />,
    <BsFillArchiveFill />,
    <BsFillAwardFill />,
    <BsBookHalf />,
    <BsFillBookFill />,
    <BsFillBarChartLineFill />,
    <BsFillBookmarksFill />,
    <BsFillBriefcaseFill />,
    <BsFillCalendarDateFill />,
    <BsFillCalendarEventFill />,
    <BsFillCalendarWeekFill />,
    <BsFillCameraFill />,
    <BsFillChatLeftDotsFill />,
    <BsFillDiagram3Fill />,
    <BsFillDiamondFill />,
    <BsFillEnvelopeFill />,
    <BsFillEnvelopeOpenFill />,
    <BsFillExclamationDiamondFill />,
    <BsFillFileEarmarkPlayFill />,
    <BsFillFileEarmarkTextFill />,
    <BsFillFlagFill />,
    <BsFillFolderFill />,
    <BsFillFolderSymlinkFill />,
    <BsFillGrid1X2Fill />,
    <BsFillGridFill />,
    <BsFillHouseFill />,
    <BsFillImageFill />,
    <BsFillInboxesFill />,
    <BsFillInfoCircleFill />,
    <BsFillInfoSquareFill />,
    <BsFillJournalBookmarkFill />,
    <BsFillKeyFill />,
    <BsFillLayersFill />,
    <BsFillPatchCheckFill />,
    <BsFillPatchQuestionFill />,
    <BsFillPersonFill />,
    <BsFillPeopleFill />,
    <BsFillPersonLinesFill />,
    <BsFillPinAngleFill />,
    <BsFillPinFill />,
    <BsFillPuzzleFill />,
    <BsFillShareFill />,
    <BsFillSignpostSplitFill />,
    <BsFillStickiesFill />,
    <BsFillTagsFill />,
    <BsColumnsGap />,
    <BsCreditCard2FrontFill />,
    <BsMailbox2 />,
    <BsMapFill />,
    <BsBoundingBox />,
    <BsStackOverflow />,
    <BsSymmetryHorizontal />,
    <BsUiChecksGrid />,
    <BsUiChecks />
]

export const Icon: React.FC<IIcon> = (props: IIcon) => {

    return (
        <>{ICONS[props.code]}</>
    )
}
