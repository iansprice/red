import { useRouter, useRoute } from 'vue-router'
import { computed, ComputedRef } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

interface PageNavigationReturn {
    goToNextPageInFolder: () => Promise<boolean>
    goToPrevPageInFolder: () => Promise<boolean>
    hasNextPage: ComputedRef<boolean>
    hasPrevPage: ComputedRef<boolean>
    folderRoutes: ComputedRef<string[]>
    currentPageIndex: ComputedRef<number>
    currentPage: ComputedRef<string>
    currentFolder: ComputedRef<string>
}

export function usePageNavigation(): PageNavigationReturn {
    const router = useRouter()
    const route = useRoute()

    const currentFolder = computed<string>(() => {
        const pathParts = route.path.split('/')
        return pathParts.slice(0, -1).join('/')
    })

    const currentPage = computed<string>(() => {
        const pathParts = route.path.split('/')
        return pathParts[pathParts.length - 1]
    })

    // Get all routes that belong to the current folder
    const folderRoutes = computed<string[]>(() => {
        const folderPath = currentFolder.value
        return router.getRoutes()
            .filter(r => {
                const routePath = r.path
                const routeParts = routePath.split('/')
                const routeFolder = routeParts.slice(0, -1).join('/')
                return routeFolder === folderPath && routeParts.length === folderPath.split('/').length + 1
            })
            .map(r => {
                const routeParts = r.path.split('/')
                return routeParts[routeParts.length - 1]
            })
            .sort((a, b) => {
                // First try to sort numerically if both pages are numbers
                const numA = parseInt(a)
                const numB = parseInt(b)
                if (!isNaN(numA) && !isNaN(numB)) {
                    return numA - numB
                }
                // Otherwise sort alphabetically
                return a.localeCompare(b)
            })
    })

    const currentPageIndex = computed<number>(() => {
        return folderRoutes.value.indexOf(currentPage.value)
    })

    const hasNextPage = computed<boolean>(() => {
        return currentPageIndex.value < folderRoutes.value.length - 1 && currentPageIndex.value !== -1
    })

    const hasPrevPage = computed<boolean>(() => {
        return currentPageIndex.value > 0
    })

    const matchesCurrentPageExact = computed(() => {
        return route.matched.length > 1
    })

    const goToNextPageInFolder = async (): Promise<boolean> => {
        if (!hasNextPage.value) return false

        const nextPage = folderRoutes.value[currentPageIndex.value + 1]
        const nextPath: RouteLocationRaw = `${currentFolder.value}/${nextPage}`
        await router.push(nextPath)
        return true
    }

    const goToPrevPageInFolder = async (): Promise<boolean> => {
        if (!hasPrevPage.value) return false

        const prevPage = folderRoutes.value[currentPageIndex.value - 1]
        const prevPath: RouteLocationRaw = `${currentFolder.value}/${prevPage}`
        await router.push(prevPath)
        return true
    }

    return {
        goToNextPageInFolder,
        goToPrevPageInFolder,
        hasNextPage,
        hasPrevPage,
        matchesCurrentPageExact,
        folderRoutes,
        currentPageIndex,
        currentPage,
        currentFolder
    }
}