import { Skeleton } from "../skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";

export function SkeletonCatalogFilters() {
  return (
    <div className="space-y-4">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>

      <Accordion
        type="multiple"
        defaultValue={["category", "price", "rating", "availability"]}
      >
        {/* Категория */}
        <AccordionItem value="category">
          <AccordionTrigger>
            <Skeleton className="h-5 w-20" />
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  {i < 2 && (
                    <div className="ml-4">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-3 w-3 rounded-sm" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Цена */}
        <AccordionItem value="price">
          <AccordionTrigger>
            <Skeleton className="h-5 w-12" />
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Skeleton className="h-2 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 flex-1" />
              </div>
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Рейтинг */}
        <AccordionItem value="rating">
          <AccordionTrigger>
            <Skeleton className="h-5 w-16" />
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Наличие */}
        <AccordionItem value="availability">
          <AccordionTrigger>
            <Skeleton className="h-5 w-16" />
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-32" />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Кнопка */}
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
