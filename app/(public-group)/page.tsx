import { Button } from "@/components/ui/button"
import Link from "next/link"


export default function HomePage() {
  console.log("Root Layout")
  return <div>
    Salam World!

    <section>
      <Button size={'lg'}>
        <Link href={'/login'}> Login</Link>
      </Button>
    </section>
    <section>
      <Button size={'lg'}>
        <Link href={'/register'}>Register</Link>
      </Button>
    </section>
  </div>
}
