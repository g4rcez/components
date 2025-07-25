import { Card } from "../../../../lib/src/components/display/card";
import { Tag } from "../../../../lib/src/components/core/tag";
import { StarIcon } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Frontend Developer",
    company: "TechCorp",
    avatar: "SC",
    content:
      "These components saved us months of development time. The TypeScript support is excellent and the accessibility features work out of the box.",
    rating: 5,
    tags: ["TypeScript", "Accessibility"],
  },
  {
    name: "Marcus Rodriguez",
    role: "Design System Lead",
    company: "StartupXYZ",
    avatar: "MR",
    content:
      "The theming system is incredibly flexible. We were able to match our brand perfectly while maintaining consistency across all components.",
    rating: 5,
    tags: ["Theming", "Design System"],
  },
  {
    name: "Emily Johnson",
    role: "Full Stack Developer",
    company: "WebAgency",
    avatar: "EJ",
    content:
      "Love the Tailwind CSS v4 integration! Container queries and CSS variables make responsive design so much easier.",
    rating: 5,
    tags: ["Tailwind CSS", "Responsive"],
  },
];

export const Testimonials = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((testimonial, index) => (
        <Card
          key={index}
          className="p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="space-y-4">
            {/* Rating */}
            <div className="flex gap-1">
              {[...Array(testimonial.rating)].map((_, i) => (
                <StarIcon
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>

            {/* Content */}
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              "{testimonial.content}"
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {testimonial.tags.map((tag, tagIndex) => (
                <Tag key={tagIndex} size="small" theme="info">
                  {tag}
                </Tag>
              ))}
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {testimonial.avatar}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white text-sm">
                  {testimonial.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {testimonial.role} at {testimonial.company}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
