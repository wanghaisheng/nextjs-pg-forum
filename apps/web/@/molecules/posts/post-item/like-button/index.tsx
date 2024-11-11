import { TPostItem } from "database"
import { Heart } from "lucide-react"
import { useTranslations } from "next-intl"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Typography } from "ui"

type LikeButtonProps = {
  post: TPostItem
}

const LikeButton: React.FC<LikeButtonProps> = ({ post }: LikeButtonProps) => {
  const t = useTranslations()

  return (
    <div className="flex h-8 items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              <Heart
                size={16}
                strokeWidth={2}
                fill="tomato"
                color="tomato"
              />
              <Typography
                variant="span"
                className="text-sm text-gray-600"
              >
                {post.totalLike}
              </Typography>
            </div>
          </TooltipTrigger>
          <TooltipContent>{`${t("common.like_plural", {
            count: post.totalLike,
          })}`}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default LikeButton
