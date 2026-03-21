/** Archive (goals) and Delete (tasks) — label color */
export const ARCHIVE_DELETE_COLOR = '#3c096c'

export const archiveOrDeleteButtonSx = {
  color: ARCHIVE_DELETE_COLOR,
  '&:hover': {
    color: ARCHIVE_DELETE_COLOR,
    bgcolor: 'rgba(60, 9, 108, 0.08)',
  },
} as const
