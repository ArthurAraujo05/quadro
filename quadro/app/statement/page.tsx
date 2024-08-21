"use client"

import MenuStatement from "@/components/statementComponents/menuStatement"
import TitleRoute from "@/components/titleRoute"
import { useState, useMemo } from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import * as lucide from "lucide-react"

export default function Statement() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  interface DataTable {
    id: number
    tag: string
    tagColor: "destructive" | "secondary" | "green" | "purple" | "blue" | "yellow" | "default" | "outline" | null | undefined
    description: string
    value: number
    data: string
  }

  const data: DataTable[] = [
    { id: 1, data: "2024-08-20", tag: "Cachorro", tagColor: "blue", description: "Ração", value: 200.00 },
    { id: 2, data: "2024-08-20", tag: "Carro", tagColor: "purple", description: "Gasolina", value: 400.00 },
    { id: 3, data: "2024-08-20", tag: "Mercado", tagColor: "yellow", description: "Compra da semana", value: 240.00 },
  ]

  type SortKey = keyof DataTable

  const [sort, setSort] = useState<{ key: SortKey; order: "asc" | "desc" }>({
    key: "id",
    order: "asc"
  })

  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        const searchValue = search.toLowerCase()
        return (
          item.tag.toLowerCase().includes(searchValue) ||
          item.description.toLowerCase().includes(searchValue) ||
          item.value.toString().includes(searchValue)
        )
      })
      .sort((a, b) => {
        if (sort.key === "value") {
          return sort.order === "asc" ? a.value - b.value : b.value - a.value
        } else {
          const aValue = a[sort.key] as string
          const bValue = b[sort.key] as string
          if (aValue < bValue) return sort.order === "asc" ? -1 : 1
          if (aValue > bValue) return sort.order === "asc" ? 1 : -1
          return 0
        }
      })
  }, [search, sort, data])

  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPageData = filteredData.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)

  const handleSort = (key: SortKey) => {
    setSort((prevSort) => ({
      key: key,
      order: prevSort.key === key && prevSort.order === "asc" ? "desc" : "asc"
    }))
  }

  const handlePageChange = (newPage: number) => setPage(newPage)

  return (
    <>
      <TitleRoute title="Extrato" />
      <div className="fixed top-0 right-0 p-5">
        <MenuStatement
          title="Menu"
          editTagOnclick={() => console.log("edit tag")}
          createTagOnclick={() => console.log("create tag")}
          exportPDFonClick={() => console.log("export pdf")}
          exportXLSXonClick={() => console.log("export xlsx")}
        />
      </div>

      <div className="flex items-center justify-center">
        <div className="w-[900px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Pesquisar..."
                value={search}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="border rounded-lg overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead> <Button variant="ghost" onClick={() => handleSort("id")}> ID </Button></TableHead>
                  <TableHead> <Button variant="ghost" onClick={() => handleSort("data")}> Date</Button></TableHead>
                  <TableHead> <Button variant="ghost" onClick={() => handleSort("tag")}> Tag </Button></TableHead>
                  <TableHead> <Button className="mr-4" variant="ghost" onClick={() => handleSort("description")}> Descrição </Button></TableHead>
                  <TableHead className="text-right"> <Button variant="ghost" onClick={() => handleSort("value")}> Valor </Button></TableHead>
                  <TableHead className="w-[32px]">
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPageData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium items-center">{item.id}</TableCell>
                    <TableCell className="font-medium items-center">{item.data}</TableCell>
                    <TableCell><Badge variant={item.tagColor}>{item.tag}</Badge></TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">R$ {item.value.toFixed(2)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <lucide.Menu className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Excluir</DropdownMenuItem>
                          <DropdownMenuItem>Copiar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  )
}
